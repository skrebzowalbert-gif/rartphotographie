import Stripe from "stripe";
import {
  orderNumberFor,
  validUntilFor,
  voucherCodeFor,
} from "@/lib/voucher-code";

export type DeliveryMode = "email" | "post";

export type VoucherOrder = {
  sessionId: string;
  orderNumber: string;
  code: string;
  /** Wert des Gutscheins (nicht der ggf. rabattierte Zahlbetrag). */
  voucherAmount: number;
  paidAmount: number;
  discountAmount: number;
  discountPercent: number;
  promotionTitle: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  recipient: string;
  message: string;
  delivery: DeliveryMode;
  address: { street: string; zip: string; city: string };
  validUntil: Date;
  createdAt: Date;
};

export function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

/**
 * Leitet alle Bestelldaten aus einer Stripe-Session ab.
 *
 * Einzige Quelle der Wahrheit für Webhook, PDF-Route und Erfolgsseite. Vorher
 * baute jede Stelle ihre eigenen Werte aus den Metadaten zusammen – dadurch
 * konnten Bestellnummer und Betrag zwischen E-Mail und Seite abweichen.
 */
export function toVoucherOrder(session: Stripe.Checkout.Session): VoucherOrder {
  const meta = session.metadata || {};
  const paidAmount =
    session.amount_total ?? Number(meta.paymentAmount || meta.amount || 0);

  return {
    sessionId: session.id,
    orderNumber: orderNumberFor(session.id, session.created),
    code: voucherCodeFor(session.id),
    voucherAmount: Number(meta.voucherAmount || paidAmount),
    paidAmount,
    discountAmount: Number(meta.discountAmount || 0),
    discountPercent: Number(meta.discountPercent || 0),
    promotionTitle: meta.promotionTitle || "",
    buyerName:
      meta.customerName || session.customer_details?.name || "Nicht angegeben",
    buyerEmail:
      session.customer_details?.email ||
      session.customer_email ||
      meta.customerEmail ||
      "",
    buyerPhone: meta.customerPhone || "",
    recipient: meta.recipient || "",
    message: meta.message || "",
    delivery: meta.delivery === "post" ? "post" : "email",
    address: {
      street: meta.street || "",
      zip: meta.zip || "",
      city: meta.city || "",
    },
    validUntil: validUntilFor(session.created),
    createdAt: new Date((session.created || 0) * 1000),
  };
}

/** Lädt eine Session und gibt sie nur zurück, wenn sie tatsächlich bezahlt ist. */
export async function loadPaidSession(sessionId: string | undefined) {
  if (!sessionId || !sessionId.startsWith("cs_")) return null;

  const stripe = getStripe();
  if (!stripe) return null;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.mode !== "payment" || session.payment_status !== "paid") {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}
