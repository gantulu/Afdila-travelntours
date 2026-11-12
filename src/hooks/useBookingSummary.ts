import { useMemo } from 'react';
import { PACKAGES_DATA } from '../data/packages';
import { calculateBookingPricing } from '../services/pricing.service';
import type { BookingDraft } from '../types/booking.types';
import type { PricingBreakdown } from '../types/pricing.types';
import type { TravelPackage } from '../types/travel.types';

interface UseBookingSummaryResult {
  activeBookingPackage: TravelPackage;
  activePricing: PricingBreakdown;
}

export function useBookingSummary(bookingDraft: BookingDraft): UseBookingSummaryResult {
  const activeBookingPackage = useMemo(
    () => PACKAGES_DATA.find((pkg) => pkg.id === bookingDraft.packageId) || PACKAGES_DATA[0],
    [bookingDraft.packageId]
  );

  const activePricing = useMemo(
    () =>
      calculateBookingPricing(
        activeBookingPackage,
        bookingDraft.optionId,
        bookingDraft.adults,
        bookingDraft.children,
        bookingDraft.infants,
        bookingDraft.promoCode
      ),
    [
      activeBookingPackage,
      bookingDraft.optionId,
      bookingDraft.adults,
      bookingDraft.children,
      bookingDraft.infants,
      bookingDraft.promoCode
    ]
  );

  return { activeBookingPackage, activePricing };
}
