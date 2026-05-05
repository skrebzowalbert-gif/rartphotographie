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
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}
