import { loadPaidSession, toVoucherOrder } from "@/lib/voucher-order";
import { buildVoucherPdf } from "@/lib/voucher-pdf";

/**
 * Download des Gutschein-PDFs.
 *
 * Wichtig für die Zuverlässigkeit: Der Käufer bekommt seinen Gutschein damit
 * auch dann, wenn der E-Mail-Versand scheitert. Der Erfolgsseite genügt die
 * Session-ID aus der Stripe-Weiterleitung, ein Datenbankeintrag ist nicht
 * nötig – die Bestellung wird bei jedem Aufruf frisch aus Stripe gelesen.
 *
 * Zugriffsschutz: Es wird nur ausgeliefert, wenn Stripe die Session als
 * bezahlt meldet. Die Session-ID ist nicht erratbar.
 */
export async function GET(req: Request) {
  const sessionId = new URL(req.url).searchParams.get("session_id") || undefined;
  const session = await loadPaidSession(sessionId);

  if (!session) {
    return Response.json(
      { error: "Zu dieser Zahlung wurde kein bezahlter Gutschein gefunden." },
      { status: 404 }
    );
  }

  const order = toVoucherOrder(session);

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

    return new Response(pdf as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Gutschein-${order.code}.pdf"`,
        // Enthält personenbezogene Daten: nicht zwischenspeichern.
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("[gutschein] PDF konnte nicht erzeugt werden:", error);
    return Response.json(
      { error: "Der Gutschein konnte nicht erzeugt werden." },
      { status: 500 }
    );
  }
}
