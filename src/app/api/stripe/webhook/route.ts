import Stripe from "stripe";
import {
  emailShell,
  escapeHtml,
  formatValue,
  getResendConfig,
  row,
} from "@/lib/email";
import { formatEuro } from "@/lib/vouchers";

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    return null;
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

function createOrderNumber(sessionId: string, date = new Date()) {
  const datePart = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(date)
    .replaceAll("-", "");

  const checksum = sessionId.split("").reduce((sum, char, index) => {
    return sum + char.charCodeAt(0) * (index + 1);
  }, 0);
  const suffix = String(checksum % 10000).padStart(4, "0");

  return `RART-${datePart}-${suffix}`;
}

export async function POST(req: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return Response.json(
      { error: "Stripe Webhook ist nicht vollständig konfiguriert." },
      { status: 500 }
    );
  }

  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return Response.json(
      { error: "Stripe Signatur fehlt." },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    return Response.json(
      { error: "Stripe Signatur ungültig." },
      { status: 400 }
    );
  }

  if (event.type !== "checkout.session.completed") {
    return Response.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const metadata = session.metadata || {};
  const customerEmail =
    session.customer_details?.email || session.customer_email || metadata.customerEmail || "";
  const customerName =
    metadata.customerName || session.customer_details?.name || "Nicht angegeben";
  const amountPaid =
    session.amount_total || Number(metadata.paymentAmount || metadata.amount || 0);
  const voucherAmount = Number(metadata.voucherAmount || amountPaid);
  const discountAmount = Number(metadata.discountAmount || 0);
  const discountPercent = Number(metadata.discountPercent || 0);
  const discountTitle = metadata.promotionTitle || "";
  const promoCode = metadata.promoCode || "";
  const paidAt = new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Berlin",
  }).format(new Date());

  const resendConfig = getResendConfig();

  if (!resendConfig.ok) {
    return Response.json(
      { error: resendConfig.error },
      { status: 500 }
    );
  }

  const voucherName = metadata.voucherName || "Gutschein";
  const street = metadata.street || metadata.address || "";
  const zip = metadata.zip || "";
  const city = metadata.city || "";
  const orderNumber = createOrderNumber(session.id);
  const adminContent = `
    ${row("Status", "Bezahlt")}
    ${row("Bestellnummer", orderNumber)}
    ${row("Gutschein", voucherName)}
    ${row("Gutscheinwert", formatEuro(voucherAmount))}
    ${row("Gezahlter Betrag", formatEuro(amountPaid))}
    ${row("Rabattaktion", discountTitle || "Keine")}
    ${row("Rabatt", discountAmount > 0 ? `-${formatEuro(discountAmount)} (${discountPercent} %)` : "Kein Rabatt")}
    ${row("Aktionscode", promoCode)}
    ${row("Name", customerName)}
    ${row("E-Mail", customerEmail)}
    ${row("Telefon", metadata.customerPhone)}
    ${row("Gutschein für", metadata.recipient)}
    ${row("Straße + Hausnummer", street)}
    ${row("PLZ", zip)}
    ${row("Ort", city)}
    ${row("Stripe Session intern", session.id)}
    ${row("Datum", paidAt)}
    <p style="margin:18px 0 6px;"><strong>Nachricht für Gutschein:</strong></p>
    <p style="white-space:pre-wrap;margin:0;">${escapeHtml(formatValue(metadata.message))}</p>
  `;

  const { error: adminError } = await resendConfig.resend.emails.send({
    from: `R.ArtPhotographie <${resendConfig.fromEmail}>`,
    to: [resendConfig.toEmail],
    replyTo: customerEmail || undefined,
    subject: `Bezahlter Gutschein ${orderNumber}: ${formatEuro(amountPaid)}`,
    html: emailShell("Gutschein bezahlt", adminContent),
    text: [
      "Gutschein bezahlt",
      "",
      `Status: Bezahlt`,
      `Bestellnummer: ${orderNumber}`,
      `Gutschein: ${voucherName}`,
      `Gutscheinwert: ${formatEuro(voucherAmount)}`,
      `Gezahlter Betrag: ${formatEuro(amountPaid)}`,
      `Rabattaktion: ${formatValue(discountTitle || "Keine")}`,
      `Rabatt: ${
        discountAmount > 0
          ? `-${formatEuro(discountAmount)} (${discountPercent} %)`
          : "Kein Rabatt"
      }`,
      `Aktionscode: ${formatValue(promoCode)}`,
      `Name: ${customerName}`,
      `E-Mail: ${customerEmail}`,
      `Telefon: ${formatValue(metadata.customerPhone)}`,
      `Gutschein für: ${formatValue(metadata.recipient)}`,
      `Straße + Hausnummer: ${formatValue(street)}`,
      `PLZ: ${formatValue(zip)}`,
      `Ort: ${formatValue(city)}`,
      `Stripe Session intern: ${session.id}`,
      `Datum: ${paidAt}`,
      "",
      "Nachricht für Gutschein:",
      formatValue(metadata.message),
    ].join("\n"),
  });

  if (adminError) {
    return Response.json(
      { error: "Benachrichtigung konnte nicht gesendet werden." },
      { status: 500 }
    );
  }

  if (customerEmail) {
    await resendConfig.resend.emails
      .send({
        from: `R.ArtPhotographie <${resendConfig.fromEmail}>`,
        to: [customerEmail],
        subject: `Dein Gutschein wurde bezahlt - ${orderNumber}`,
        html: emailShell(
          "Zahlung erfolgreich",
          `
            <p style="margin:0 0 14px;">Hallo ${escapeHtml(customerName)},</p>
            <p style="margin:0 0 14px;">deine Zahlung ist eingegangen. Regina bereitet deinen Gutschein vor und meldet sich, falls noch Details offen sind.</p>
            ${row("Bestellnummer", orderNumber)}
            ${row("Gutschein", voucherName)}
            ${row("Gutscheinwert", formatEuro(voucherAmount))}
            ${row("Gezahlter Betrag", formatEuro(amountPaid))}
            ${discountAmount > 0 ? row("Rabatt", `-${formatEuro(discountAmount)} (${discountPercent} %)`) : ""}
            ${row("Versandadresse", [street, zip, city].filter(Boolean).join(", "))}
            ${row("Datum", paidAt)}
          `
        ),
        text: [
          `Hallo ${customerName},`,
          "",
          "deine Zahlung ist eingegangen. Regina bereitet deinen Gutschein vor und meldet sich, falls noch Details offen sind.",
          "",
          `Bestellnummer: ${orderNumber}`,
          `Gutschein: ${voucherName}`,
          `Gutscheinwert: ${formatEuro(voucherAmount)}`,
          `Gezahlter Betrag: ${formatEuro(amountPaid)}`,
          discountAmount > 0
            ? `Rabatt: -${formatEuro(discountAmount)} (${discountPercent} %)`
            : "",
          `Versandadresse: ${formatValue([street, zip, city].filter(Boolean).join(", "))}`,
          `Datum: ${paidAt}`,
        ].join("\n"),
      })
      .catch(() => null);
  }

  return Response.json({ received: true });
}
