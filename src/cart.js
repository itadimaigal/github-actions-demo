// Business logic: the cart total from the "Naming Things" episode.
export const PREMIUM_DISCOUNT = 0.9;

export function cartTotal(items, isPremiumMember = false) {
  let total = 0;
  for (const item of items) {
    const discounted = isPremiumMember && item.onSale;
    total += discounted ? item.price * PREMIUM_DISCOUNT : item.price;
  }
  return Math.round(total * 100) / 100;
}

export function formatINR(amount) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);
}
