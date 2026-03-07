export function calculateTierPrice(
  publicPrice: number,
  tier: "public" | "vip" | "family"
) {
  if (tier === "public") return publicPrice;

  // $100 and above
  if (publicPrice >= 100) {
    return tier === "vip"
      ? publicPrice - 20
      : publicPrice - 40;
  }

  // $60 to $99.99
  if (publicPrice >= 60) {
    return tier === "vip"
      ? publicPrice - 10
      : publicPrice - 20;
  }

  // Below $60 → no discount
  return publicPrice;
}