import Stripe from "stripe";
import { emailShell, escapeHtml, formatValue, getResendConfig, row } from "@/lib/email";
import { formatEuro } from "@/lib/vouchers";
import { formatGermanDate } from "@/lib/voucher-code";
import { getStripe, toVoucherOrder, type VoucherOrder } from "@/lib/voucher-order";
import { buildVoucherPdf } from "@/lib/voucher-pdf";
import { siteUrl } from "@/lib/site";

/** Marker in den Stripe-Metadaten, der eine bereits verarbeitete Bestellung kennzeichnet. */
const PROCESSED_FLAG = "voucherIssuedAt";

/**
 * Prüft und setzt die Verarbeitungsmarke.
 *
 * Ohne Datenbank dient Stripe selbst als Speicher: Die Marke wird in die
 * Metadaten des PaymentIntent geschrieben. Sie wird BEWUSST vor dem Versand
 * gesetzt. Schlägt danach etwas fehl, geht im schlimmsten Fall eine Mail
 * verloren – nie aber geht eine doppelt raus. Der Käufer kommt trotzdem an
 * seinen Gutschein, weil die Erfolgsseite ihn direkt zum Download anbietet.
 */
async function claimOrder(stripe: Stripe, session: Stripe.Checkout.Session) {
  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id;

  if (!paymentIntentId) {
    // Ohne PaymentIntent lässt sich keine Marke setzen. Lieber einmal zu viel
    // verarbeiten als den Gutschein gar nicht auszuliefern – das wird geloggt.
    console.warn(
      "[webhook] Kein PaymentIntent an der Session, Idempotenz nicht möglich:",
      session.id
    );
    return { alreadyProcessed: false as const };
  }

  const intent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (intent.metadata?.[PROCESSED_FLAG]) {
    return { alreadyProcessed: true as const };
  }

  await stripe.paymentIntents.update(paymentIntentId, {
    metadata: { ...intent.metadata, [PROCESSED_FLAG]: new Date().toISOString() },
  });

  return { alreadyProcessed: false as const };
}

function adminEmail(order: VoucherOrder, paidAt: string) {
  const deliveryLabel =
    order.delivery === "post"
      ? "Post (zusätzlich zum PDF)"
      : "Nur digital (PDF per E-Mail)";

  return {
    subject: `Gutschein verkauft ${order.orderNumber}: ${formatEuro(order.paidAmount)}`,
    html: emailShell(
      "Gutschein bezahlt",
      `
        ${row("Bestellnummer", order.orderNumber)}
        ${row("Gutscheincode", order.code)}
        ${row("Gutscheinwert", formatEuro(order.voucherAmount))}
        ${row("Gezahlter Betrag", formatEuro(order.paidAmount))}
        ${
          order.discountAmount > 0
            ? row(
                "Rabatt",
                `-${formatEuro(order.discountAmount)} (${order.discountPercent} %) · ${order.promotionTitle}`
              )
            : ""
        }
        ${row("Gültig bis", formatGermanDate(order.validUntil))}
        ${row("Zustellung", deliveryLabel)}
        ${row("Käufer", order.buyerName)}
        ${row("E-Mail", order.buyerEmail)}
        ${row("Telefon", order.buyerPhone)}
        ${row("Gutschein für", order.recipient)}
        ${
          order.delivery === "post"
            ? row(
                "Postanschrift",
                [order.address.street, `${order.address.zip} ${order.address.city}`.trim()]
                  .filter(Boolean)
                  .join(", ")
              )
            : ""
        }
        ${row("Bezahlt am", paidAt)}
        <p style="margin:18px 0 6px;"><strong>Nachricht auf dem Gutschein:</strong></p>
        <p style="white-space:pre-wrap;margin:0;">${escapeHtml(formatValue(order.message))}</p>
        <p style="margin:18px 0 0;font-size:13px;color:#666;">Das PDF hängt an dieser E-Mail. Stripe-Session: ${escapeHtml(order.sessionId)}</p>
      `
    ),
    text: [
      "Gutschein bezahlt",
      "",
      `Bestellnummer: ${order.orderNumber}`,
      `Gutscheincode: ${order.code}`,
      `Gutscheinwert: ${formatEuro(order.voucherAmount)}`,
      `Gezahlter Betrag: ${formatEuro(order.paidAmount)}`,
      `Gültig bis: ${formatGermanDate(order.validUntil)}`,
      `Zustellung: ${deliveryLabel}`,
      `Käufer: ${order.buyerName}`,
      `E-Mail: ${order.buyerEmail}`,
      `Telefon: ${formatValue(order.buyerPhone)}`,
      `Gutschein für: ${formatValue(order.recipient)}`,
      order.delivery === "post"
        ? `Postanschrift: ${[order.address.street, order.address.zip, order.address.city].filter(Boolean).join(", ")}`
        : "",
      `Bezahlt am: ${paidAt}`,
      "",
      "Nachricht auf dem Gutschein:",
      formatValue(order.message),
    ]
      .filter(Boolean)
      .join("\n"),
  };
}

function buyerEmail(order: VoucherOrder) {
  const downloadUrl = `${siteUrl}/api/gutschein/pdf?session_id=${encodeURIComponent(order.sessionId)}`;

  return {
    subject: `Dein Gutschein über ${formatEuro(order.voucherAmount)} – ${order.orderNumber}`,
    html: emailShell(
      "Dein Gutschein ist da",
      `
        <p style="margin:0 0 14px;">Hallo ${escapeHtml(order.buyerName)},</p>
        <p style="margin:0 0 14px;">vielen Dank. Dein Gutschein hängt als PDF an dieser E-Mail – zum Ausdrucken oder digitalen Verschenken.</p>
        ${row("Gutscheincode", order.code)}
        ${row("Wert", formatEuro(order.voucherAmount))}
        ${row("Gültig bis", formatGermanDate(order.validUntil))}
        ${row("Bestellnummer", order.orderNumber)}
        ${
          order.delivery === "post"
            ? `<p style="margin:14px 0;">Zusätzlich wird der Gutschein auf hochwertigem Papier vorbereitet und an die angegebene Adresse geschickt.</p>`
            : ""
        }
        <p style="margin:18px 0 0;">Falls der Anhang nicht ankommt, kannst du den Gutschein hier erneut herunterladen:<br>
        <a href="${downloadUrl}">${downloadUrl}</a></p>
        <p style="margin:18px 0 0;font-size:13px;color:#666;">Zum Einlösen genügt es, den Code bei der Anfrage anzugeben.</p>
      `
    ),
    text: [
      `Hallo ${order.buyerName},`,
      "",
      "vielen Dank. Dein Gutschein hängt als PDF an dieser E-Mail.",
      "",
      `Gutscheincode: ${order.code}`,
      `Wert: ${formatEuro(order.voucherAmount)}`,
      `Gültig bis: ${formatGermanDate(order.validUntil)}`,
      `Bestellnummer: ${order.orderNumber}`,
      "",
      order.delivery === "post"
        ? "Zusätzlich wird der Gutschein auf hochwertigem Papier vorbereitet und verschickt."
        : "",
      `Erneut herunterladen: ${downloadUrl}`,
      "",
      "Zum Einlösen genügt es, den Code bei der Anfrage anzugeben.",
    ]
      .filter(Boolean)
      .join("\n"),
  };
}

export async function POST(req: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    console.error("[webhook] Stripe ist nicht vollständig konfiguriert.");
    return Response.json({ error: "Nicht konfiguriert." }, { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return Response.json({ error: "Signatur fehlt." }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      await req.text(),
      signature,
      webhookSecret
    );
  } catch {
    return Response.json({ error: "Signatur ungültig." }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return Response.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  try {
    const { alreadyProcessed } = await claimOrder(stripe, session);

    if (alreadyProcessed) {
      console.info(
        "[webhook] Bestellung war bereits verarbeitet, übersprungen:",
        session.id
      );
      return Response.json({ received: true, skipped: true });
    }
  } catch (error) {
    // Konnte die Marke nicht gesetzt werden, ist Idempotenz nicht sichergestellt.
    // Dann lieber Stripe erneut zustellen lassen, als ungeschützt zu versenden.
    console.error("[webhook] Idempotenzmarke fehlgeschlagen:", error);
    return Response.json({ error: "Bitte erneut zustellen." }, { status: 500 });
  }

  const order = toVoucherOrder(session);
  const paidAt = new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Berlin",
  }).format(order.createdAt);

  const resendConfig = getResendConfig();

  if (!resendConfig.ok) {
    // Die Zahlung ist erfolgt. Ein Fehlschlag hier darf keinen erneuten
    // Zustellversuch auslösen, sonst entstehen Doppelversände.
    console.error(
      "[webhook] Zahlung eingegangen, aber E-Mail nicht konfiguriert. Bestellung:",
      order.orderNumber,
      order.sessionId
    );
    return Response.json({ received: true, mailed: false });
  }

  let attachment: { filename: string; content: string } | undefined;

  try {
    const pdf = await buildVoucherPdf({
      orderNumber: order.orderNumber,
      code: order.code,
      amountInCents: order.voucherAmount,
      recipient: order.recipient,
      buyerName: order.buyerName,
      message: order.message,
      validUntil: order.validUntil,
    });

    attachment = {
      filename: `Gutschein-${order.code}.pdf`,
      content: Buffer.from(pdf).toString("base64"),
    };
  } catch (error) {
    console.error(
      "[webhook] PDF fehlgeschlagen, Mails gehen ohne Anhang raus:",
      order.orderNumber,
      error
    );
  }

  const admin = adminEmail(order, paidAt);
  const { error: adminError } = await resendConfig.resend.emails
    .send({
      from: `R.ArtPhotographie <${resendConfig.fromEmail}>`,
      to: [resendConfig.toEmail],
      replyTo: order.buyerEmail || undefined,
      subject: admin.subject,
      html: admin.html,
      text: admin.text,
      attachments: attachment ? [attachment] : undefined,
    })
    .catch((cause: unknown) => ({ error: cause }));

  if (adminError) {
    // FRÜHER: hier wurde HTTP 500 zurückgegeben. Stripe stellte daraufhin
    // erneut zu und beim nächsten Versuch gingen BEIDE Mails ein zweites Mal
    // raus. Jetzt wird der Fehler nur protokolliert.
    console.error(
      "[webhook] Händler-Benachrichtigung fehlgeschlagen:",
      order.orderNumber,
      adminError
    );
  }

  if (order.buyerEmail) {
    const buyer = buyerEmail(order);
    const { error: buyerError } = await resendConfig.resend.emails
      .send({
        from: `R.ArtPhotographie <${resendConfig.fromEmail}>`,
        to: [order.buyerEmail],
        subject: buyer.subject,
        html: buyer.html,
        text: buyer.text,
        attachments: attachment ? [attachment] : undefined,
      })
      .catch((cause: unknown) => ({ error: cause }));

    if (buyerError) {
      console.error(
        "[webhook] Gutschein-Mail an den Käufer fehlgeschlagen:",
        order.orderNumber,
        order.buyerEmail,
        buyerError
      );
    }
  }

  // Ab hier immer 200: Die Zahlung ist abgeschlossen und die Bestellung als
  // verarbeitet markiert. Ein erneuter Zustellversuch würde nichts verbessern.
  return Response.json({ received: true, orderNumber: order.orderNumber });
}
