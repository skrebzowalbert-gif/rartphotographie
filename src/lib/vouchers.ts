export type CheckoutVoucherId = "wert-custom";

export type VoucherProduct = {
  id: CheckoutVoucherId;
  name: string;
  description: string;
  amount: number;
  customAmount?: boolean;
};

export const voucherProducts: VoucherProduct[] = [
  {
    id: "wert-custom",
    name: "Wertgutschein R.ArtPhotographie",
    description: "Wertgutschein für Fotografie bei R.ArtPhotographie",
    amount: 0,
    customAmount: true,
  },
];

export function getVoucherProduct(id: string) {
  return voucherProducts.find((product) => product.id === id);
}

export function formatEuro(cents: number) {
  const hasCents = Math.abs(cents) % 100 !== 0;

  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: hasCents ? 2 : 0,
  }).format(cents / 100);
}
