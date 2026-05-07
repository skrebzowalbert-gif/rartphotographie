import Stripe from "stripe";
import { clean } from "@/lib/email";
import { calculateVoucherDiscount, getVoucherDiscountPromotion } from "@/lib/promotions";
import { siteUrl } from "@/lib/site";
import { formatEuro } from "@/lib/vouchers";
import { getActivePromotions } from "@/sanity/queries";

type CheckoutPayload = {
  voucherCustomAmount?: string;
  voucherAmount?: number;
  paymentAmount?: number;
  discountAmount?: number;
  discountPercent?: number;
  promotionId?: string;
  name?: string;
  email?: string;
  phone?: string;
  recipient?: string;
  message?: string;
  street?: string;
  zip?: string;
  city?: string;
};

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    return null;
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

function metadataValue(value: string) {
  return value.slice(0, 500);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CheckoutPayload;
    const voucherCustomAmount = clean(body.voucherCustomAmount, 20);
    const name = clean(body.name, 120);
    const email = clean(body.email, 180);
    const phone = clean(body.phone, 40);
    const recipient = clean(body.recipient, 160);
    const message = clean(body.message, 500);
    const street = clean(body.street, 160);
    const zip = clean(body.zip, 16);
    const city = clean(body.city, 80);

    const amount = Number(voucherCustomAmount.replace(",", "."));
    const voucherAmount = Math.round(amount * 100);

    if (!voucherCustomAmount || Number.isNaN(amount) || voucherAmount < 5000) {
      return Response.json(
        { error: "Bitte gib einen Gutscheinbetrag ab 50 € ein." },
        { status: 400 }
      );
    }

    if (!name || !email || !recipient || !street || !zip || !city) {
      return Response.json(
        {
          error:
            "Name, E-Mail, Gutscheinempfänger und Versandadresse sind für den Gutschein-Kauf erforderlich.",
        },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json(
        { error: "Bitte gib eine gültige E-Mail-Adresse ein." },
        { status: 400 }
      );
    }

    if (phone && !/^[+\d\s()/.-]{5,40}$/.test(phone)) {
      return Response.json(
        { error: "Bitte gib eine gültige Telefonnummer ein." },
        { status: 400 }
      );
    }

    const stripe = getStripe();

    if (!stripe || !process.env.NEXT_PUBLIC_SITE_URL) {
      return Response.json(
        { error: "Checkout ist noch nicht vollständig konfiguriert." },
        { status: 500 }
      );
    }

    const voucherName = "Wertgutschein R.ArtPhotographie";
    const address = [street, zip, city].filter(Boolean).join(", ");
    const activePromotions = await getActivePromotions();
    const voucherPromotion = getVoucherDiscountPromotion(activePromotions);
    const pricing = calculateVoucherDiscount(voucherAmount, voucherPromotion);
    const paymentAmount = pricing.paymentAmount;
    const discountLabel =
      voucherPromotion && pricing.discountAmount > 0
        ? voucherPromotion.badge || voucherPromotion.title
        : "";

    if (paymentAmount < 50) {
      return Response.json(
        { error: "Der rabattierte Zahlbetrag ist für Stripe zu niedrig." },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      success_url: `${siteUrl}/gutscheine/erfolg?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/gutscheine?zahlung=abgebrochen`,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: paymentAmount,
            product_data: {
              name: voucherName,
              description: `Wertgutschein über ${formatEuro(voucherAmount)}`,
            },
          },
        },
      ],
      metadata: {
        voucherId: "wert-custom",
        voucherName,
        amount: String(paymentAmount),
        voucherAmount: String(voucherAmount),
        paymentAmount: String(paymentAmount),
        discountAmount: String(pricing.discountAmount),
        discountPercent: String(pricing.percent),
        promotionId: metadataValue(voucherPromotion?.id || ""),
        promotionTitle: metadataValue(discountLabel),
        promoCode: metadataValue(voucherPromotion?.promoCode || ""),
        customerName: metadataValue(name),
        customerEmail: metadataValue(email),
        customerPhone: metadataValue(phone),
        recipient: metadataValue(recipient),
        message: metadataValue(message),
        street: metadataValue(street),
        zip: metadataValue(zip),
        city: metadataValue(city),
        address: metadataValue(address),
      },
      payment_intent_data: {
        metadata: {
          voucherId: "wert-custom",
          voucherName,
          amount: String(paymentAmount),
          voucherAmount: String(voucherAmount),
          paymentAmount: String(paymentAmount),
          discountAmount: String(pricing.discountAmount),
          discountPercent: String(pricing.percent),
          promotionId: metadataValue(voucherPromotion?.id || ""),
          promotionTitle: metadataValue(discountLabel),
          promoCode: metadataValue(voucherPromotion?.promoCode || ""),
          customerName: metadataValue(name),
          customerEmail: metadataValue(email),
          customerPhone: metadataValue(phone),
          recipient: metadataValue(recipient),
          message: metadataValue(message),
          street: metadataValue(street),
          zip: metadataValue(zip),
          city: metadataValue(city),
          address: metadataValue(address),
        },
      },
    });

    if (!session.url) {
      return Response.json(
        { error: "Checkout konnte nicht gestartet werden." },
        { status: 500 }
      );
    }

    return Response.json({ url: session.url });
  } catch {
    return Response.json(
      { error: "Checkout konnte nicht gestartet werden." },
      { status: 500 }
    );
  }
}
