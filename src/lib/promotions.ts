import type { SanityPromotion } from "@/sanity/queries";

export type VoucherDiscount = {
  percent: number;
  discountAmount: number;
  paymentAmount: number;
};

export function getVoucherDiscountPromotion(
  promotions: SanityPromotion[]
): SanityPromotion | null {
  return (
    promotions.find((promotion) => {
      const appliesTo = promotion.appliesTo || "vouchers";

      return (
        (appliesTo === "vouchers" || appliesTo === "all") &&
        promotion.discountType === "percent" &&
        typeof promotion.discountValue === "number" &&
        promotion.discountValue > 0
      );
    }) || null
  );
}

export function calculateVoucherDiscount(
  voucherAmount: number,
  promotion?: SanityPromotion | null
): VoucherDiscount {
  if (
    !promotion ||
    promotion.discountType !== "percent" ||
    typeof promotion.discountValue !== "number"
  ) {
    return {
      percent: 0,
      discountAmount: 0,
      paymentAmount: voucherAmount,
    };
  }

  const percent = Math.min(100, Math.max(0, promotion.discountValue));
  const discountAmount = Math.round((voucherAmount * percent) / 100);

  return {
    percent,
    discountAmount,
    paymentAmount: Math.max(0, voucherAmount - discountAmount),
  };
}
