export interface PricingBreakdown {
  optionDelta: number;
  adultUnitPrice: number;
  childUnitPrice: number;
  infantUnitPrice: number;
  adultsTotal: number;
  childrenTotal: number;
  infantsTotal: number;
  baseSubtotal: number;
  packageDiscountTotal: number;
  subtotalAfterPackageDiscount: number;
  promoDiscount: number;
  promoCodeValid: boolean;
  promoLabel?: string;
  serviceFee: number;
  totalAmount: number;
  totalTravelers: number;
}
