import React, { useState, useEffect, useCallback } from 'react';
import {
  Home, Compass, Heart, Briefcase, User, Bell, Search, MapPin, Calendar, Users,
  ChevronLeft, ChevronRight, Star, Clock, ShieldCheck, CheckCircle2, XCircle,
  AlertCircle, Info, SlidersHorizontal, ArrowUpDown, Phone, Mail, MessageCircle,
  Sparkles, Plane, Hotel, Bus, Utensils, Camera, Share2, FileText, HelpCircle,
  Building2, Plus, Minus, X, Loader2, Copy, Award, Headphones, Wallet, Tag,
  LogOut, Settings, Check
} from 'lucide-react';

import { TRAVEL_CATEGORIES } from './src/data/travel-categories';
import { DESTINATIONS_DATA } from './src/data/destinations';
import { PACKAGES_DATA } from './src/data/packages';
import { PAYMENT_CHANNELS } from './src/data/payment-channels';
import { INITIAL_NOTIFICATIONS } from './src/data/notifications';
import { reconcileTravelers } from './src/services/booking.service';
import { getPackageById, getPackagesByDestination } from './src/services/package.service';
import { getDestinationById, getOtherDestinations } from './src/services/destination.service';
import { formatIDR } from './src/utils/currency';
import { calculateReturnDate, formatDateReadable } from './src/utils/date';
import { generateBookingReference } from './src/utils/booking-reference';
import { isValidEmail, isValidPhone } from './src/utils/validation';
import { usePackageCatalog } from './src/hooks/usePackageCatalog';
import { useBookingSummary } from './src/hooks/useBookingSummary';
import { Badge, AlertBanner, EmptyState } from './src/components/ui/FeedbackComponents';
import { ModalDialog, BottomSheet } from './src/components/ui/OverlayComponents';
import { PackageCard } from './src/components/PackageCard';
import type { TravelPackage } from './src/types/travel.types';
import type { Traveler, BookingDraft, GuestInformation, Booking } from './src/types/booking.types';
import type { AppNotification } from './src/types/notification.types';
import type { MainTab, StandaloneView } from './src/types/navigation.types';
import type { ToastMessage } from './src/types/common.types';
import type { PriceFilter, PackageSort } from './src/hooks/usePackageCatalog';
import { HomePage } from './src/pages/HomePage';
import { ExplorePage } from './src/pages/ExplorePage';
import { WishlistPage } from './src/pages/WishlistPage';
import { MyTripsPage } from './src/pages/MyTripsPage';

// ============================================================================
// 4. GLOBAL STYLES (DEEP NAVY & OCEAN BLUE DESIGN SYSTEM)
// ============================================================================

const GLOBAL_STYLES = `
:root {
  --color-navy: #0B2545;
  --color-navy-dark: #06172D;
  --color-ocean: #136F99;
  --color-ocean-light: #E7F3F8;
  --color-accent: #D97706;
  --color-accent-light: #FEF3C7;
  --color-bg: #F4F6F9;
  --color-surface: #FFFFFF;
  --color-border: #E2E8F0;
  --color-text: #111827;
  --color-text-secondary: #4B5563;
  --color-text-muted: #9CA3AF;
  --radius-md: 14px;
  --radius-lg: 20px;
  font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

* {
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

html,
body,
#root {
  height: 100%;
  margin: 0;
  background-color: #E2E8F0;
  color: var(--color-text);
}

#root {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  background-color: var(--color-bg);
  box-shadow: 0 0 40px rgba(11, 37, 69, 0.14);
}

.app-shell {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: var(--color-bg);
}

.app-header {
  position: sticky;
  top: 0;
  flex-shrink: 0;
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  padding-top: env(safe-area-inset-top, 0px);
  z-index: 30;
}

.app-global-header {
  isolation: isolate;
}

.app-content {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}

.bottom-nav {
  flex-shrink: 0;
  background-color: var(--color-surface);
  border-top: 1px solid var(--color-border);
  padding-bottom: env(safe-area-inset-bottom, 0px);
  z-index: 20;
}

.bottom-action-bar {
  flex-shrink: 0;
  background-color: var(--color-surface);
  border-top: 1px solid var(--color-border);
  padding: 12px 16px calc(12px + env(safe-area-inset-bottom, 0px));
  box-shadow: 0 -4px 16px rgba(11, 37, 69, 0.06);
  z-index: 20;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0.6;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.97);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-slide-up {
  animation: slideUp 0.24s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-fade-in {
  animation: fadeIn 0.18s ease-out forwards;
}
`;

// ============================================================================
// 6. MAIN APPLICATION COMPONENT (SINGLE APP.TSX)
// ============================================================================

export function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<MainTab>('home');
  const [standalone, setStandalone] = useState<StandaloneView>(null);

  // Storefront Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDestinationFilter, setSelectedDestinationFilter] = useState<string>('All');
  const [priceFilter, setPriceFilter] = useState<PriceFilter>('all');
  const [durationFilter, setDurationFilter] = useState<'all' | '1to3' | '4to5' | '6plus'>('all');
  const [sortBy, setSortBy] = useState<PackageSort>('recommended');
  const [filterSheetOpen, setFilterSheetOpen] = useState<boolean>(false);

  // Wishlist & Notifications State
  const [wishlistIds, setWishlistIds] = useState<string[]>(['pkg-bali-ubud-4d3n']);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [notificationModalOpen, setNotificationModalOpen] = useState<boolean>(false);

  // Package Detail Gallery State
  const [galleryIndex, setGalleryIndex] = useState<number>(0);

  // Booking Draft & Checkout State (Persisted across back/forward navigation)
  const [bookingDraft, setBookingDraft] = useState<BookingDraft>({
    packageId: PACKAGES_DATA[0].id,
    optionId: PACKAGES_DATA[0].packageOptions[0].id,
    departureDate: PACKAGES_DATA[0].departureDates[0] || '',
    adults: 2,
    children: 0,
    infants: 0,
    travelers: reconcileTravelers([], 2, 0, 0),
    promoCode: '',
    specialRequest: ''
  });

  const [guestInfo, setGuestInfo] = useState<GuestInformation>({
    fullName: '',
    email: '',
    phone: '',
    whatsapp: ''
  });
  const [sameWhatsappAsPhone, setSameWhatsappAsPhone] = useState<boolean>(true);
  const [contactIsMainTraveler, setContactIsMainTraveler] = useState<boolean>(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>('bank_transfer_verified');
  const [agreedTerms, setAgreedTerms] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmittingBooking, setIsSubmittingBooking] = useState<boolean>(false);

  // Bookings Store & My Trips Filter State
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tripSubTab, setTripSubTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const [lookupRef, setLookupRef] = useState<string>('');
  const [lookupContact, setLookupContact] = useState<string>('');
  const [lookupError, setLookupError] = useState<string>('');
  const [verifiedBookingRefs, setVerifiedBookingRefs] = useState<string[]>([]);

  // Global Modals & Toasts
  const [legalModal, setLegalModal] = useState<'terms' | 'privacy' | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: ToastMessage['type'] = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3400);
  }, []);

  const toggleWishlist = useCallback(
    (pkgId: string) => {
      setWishlistIds((prev) => {
        const exists = prev.includes(pkgId);
        if (exists) {
          showToast('Removed from Wishlist.', 'info');
          return prev.filter((id) => id !== pkgId);
        } else {
          showToast('Saved to Wishlist.', 'success');
          return [...prev, pkgId];
        }
      });
    },
    [showToast]
  );

  // Sync WhatsApp when checkbox active
  useEffect(() => {
    if (sameWhatsappAsPhone) {
      setGuestInfo((prev) => ({ ...prev, whatsapp: prev.phone }));
    }
  }, [sameWhatsappAsPhone, guestInfo.phone]);

  // Sync Main Traveler when "Contact Person is the Main Traveler" is toggled
  useEffect(() => {
    if (contactIsMainTraveler) {
      setBookingDraft((prev) => {
        if (prev.travelers.length === 0) return prev;
        const updated = [...prev.travelers];
        updated[0] = {
          ...updated[0],
          fullName: guestInfo.fullName
        };
        return { ...prev, travelers: updated };
      });
    }
  }, [contactIsMainTraveler, guestInfo.fullName]);

  const { activeBookingPackage, activePricing } = useBookingSummary(bookingDraft);

  const { filteredPackages, activeFilterCount } = usePackageCatalog({
    searchQuery,
    selectedCategory,
    selectedDestinationFilter,
    priceFilter,
    durationFilter,
    sortBy
  });

  // Navigation Helpers
  const openPackageDetail = (packageId: string) => {
    setGalleryIndex(0);
    setStandalone({ type: 'package', packageId });
  };

  const openDestinationDetail = (destinationId: string) => {
    setStandalone({ type: 'destination', destinationId });
  };

  const startBookingForPackage = (packageId: string) => {
    const pkg = getPackageById(packageId);
    if (!pkg) {
      showToast('Selected package could not be found.', 'error');
      return;
    }

    setBookingDraft((prev) => {
      const isSamePkg = prev.packageId === pkg.id;
      const defaultAdults = Math.max(pkg.minTravelers, isSamePkg ? prev.adults : 2);
      const validAdults = Math.min(defaultAdults, pkg.maxTravelers);
      const validChildren = isSamePkg && validAdults + prev.children <= pkg.maxTravelers ? prev.children : 0;
      const validInfants = isSamePkg ? prev.infants : 0;
      const validDate =
        isSamePkg && pkg.departureDates.includes(prev.departureDate)
          ? prev.departureDate
          : pkg.departureDates[0] || '';
      const validOption =
        isSamePkg && pkg.packageOptions.some((o) => o.id === prev.optionId)
          ? prev.optionId
          : pkg.packageOptions[0].id;

      return {
        packageId: pkg.id,
        optionId: validOption,
        departureDate: validDate,
        adults: validAdults,
        children: validChildren,
        infants: validInfants,
        travelers: reconcileTravelers(isSamePkg ? prev.travelers : [], validAdults, validChildren, validInfants),
        promoCode: isSamePkg ? prev.promoCode : '',
        specialRequest: isSamePkg ? prev.specialRequest : ''
      };
    });
    setFormErrors({});
    setStandalone({ type: 'booking', packageId: pkg.id });
  };

  const updateTravelerCounts = (newAdults: number, newChildren: number, newInfants: number) => {
    const pkg = activeBookingPackage;
    const totalSeats = newAdults + newChildren;
    if (newAdults < 1) {
      showToast('At least 1 adult traveler is required.', 'warning');
      return;
    }
    if (totalSeats > pkg.maxTravelers) {
      showToast(`Maximum ${pkg.maxTravelers} travelers allowed for this package.`, 'warning');
      return;
    }
    if (newInfants > newAdults) {
      showToast('Number of infants cannot exceed adult travelers.', 'warning');
      return;
    }

    setBookingDraft((prev) => {
      const nextTravelers = reconcileTravelers(prev.travelers, newAdults, newChildren, newInfants);
      if (contactIsMainTraveler && nextTravelers.length > 0) {
        nextTravelers[0] = { ...nextTravelers[0], fullName: guestInfo.fullName };
      }
      return {
        ...prev,
        adults: newAdults,
        children: newChildren,
        infants: newInfants,
        travelers: nextTravelers
      };
    });
  };

  const handleProceedToCheckout = () => {
    const pkg = activeBookingPackage;
    const totalSeats = bookingDraft.adults + bookingDraft.children;
    if (!bookingDraft.departureDate) {
      showToast('Please select a departure date first.', 'error');
      return;
    }
    if (totalSeats < pkg.minTravelers) {
      showToast(`This package requires a minimum of ${pkg.minTravelers} travelers.`, 'error');
      return;
    }
    if (totalSeats > pkg.maxTravelers) {
      showToast(`Maximum ${pkg.maxTravelers} travelers allowed.`, 'error');
      return;
    }
    setFormErrors({});
    setStandalone({ type: 'checkout' });
  };

  const validateCheckoutForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!bookingDraft.packageId) errors.package = 'No travel package selected.';
    if (!bookingDraft.departureDate) errors.departureDate = 'Departure date is required.';

    if (!guestInfo.fullName.trim() || guestInfo.fullName.trim().length < 3) {
      errors.guestFullName = 'Please enter contact person full name (min. 3 characters).';
    }
    if (!guestInfo.email.trim() || !isValidEmail(guestInfo.email)) {
      errors.guestEmail = 'Please enter a valid email address for booking confirmation.';
    }
    if (!guestInfo.phone.trim() || !isValidPhone(guestInfo.phone)) {
      errors.guestPhone = 'Please enter a valid phone number (8–15 digits).';
    }
    const effectiveWa = sameWhatsappAsPhone ? guestInfo.phone : guestInfo.whatsapp;
    if (effectiveWa && !isValidPhone(effectiveWa)) {
      errors.guestWhatsapp = 'Please enter a valid WhatsApp number.';
    }

    bookingDraft.travelers.forEach((t, idx) => {
      if (!t.fullName.trim() || t.fullName.trim().length < 2) {
        errors[`traveler_${idx}_name`] = `Traveler #${idx + 1} full name is required.`;
      }
      if (!t.gender) {
        errors[`traveler_${idx}_gender`] = `Select gender for Traveler #${idx + 1}.`;
      }
    });

    const chosenPayment = PAYMENT_CHANNELS.find((c) => c.id === selectedPaymentId);
    if (!chosenPayment || !chosenPayment.available) {
      errors.paymentMethod = 'Please select an available payment settlement method.';
    }

    if (!agreedTerms) {
      errors.terms = 'You must agree to the Terms & Conditions and Privacy Policy.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleConfirmBooking = async () => {
    if (isSubmittingBooking) return;
    if (!validateCheckoutForm()) {
      showToast('Please complete all required fields highlighted in red.', 'error');
      return;
    }

    setIsSubmittingBooking(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 850));

      const chosenPayment = PAYMENT_CHANNELS.find((c) => c.id === selectedPaymentId)!;
      const chosenOption =
        activeBookingPackage.packageOptions.find((o) => o.id === bookingDraft.optionId) ||
        activeBookingPackage.packageOptions[0];
      const reference = generateBookingReference();
      const effectiveWhatsapp = sameWhatsappAsPhone ? guestInfo.phone.trim() : guestInfo.whatsapp.trim();

      const newBooking: Booking = {
        bookingReference: reference,
        createdAt: new Date().toISOString(),
        packageId: activeBookingPackage.id,
        packageName: activeBookingPackage.name,
        optionName: chosenOption.name,
        destination: activeBookingPackage.destination,
        duration: activeBookingPackage.duration,
        packageImage: activeBookingPackage.images[0],
        guest: {
          fullName: guestInfo.fullName.trim(),
          email: guestInfo.email.trim(),
          phone: guestInfo.phone.trim(),
          whatsapp: effectiveWhatsapp
        },
        travelers: bookingDraft.travelers.map((t) => ({
          ...t,
          fullName: t.fullName.trim(),
          identityNumber: t.identityNumber.trim(),
          specialRequirements: t.specialRequirements.trim()
        })),
        departureDate: bookingDraft.departureDate,
        meetingPoint: activeBookingPackage.meetingPoint,
        departureLocation: activeBookingPackage.departureLocation,
        adults: bookingDraft.adults,
        children: bookingDraft.children,
        infants: bookingDraft.infants,
        subtotal: activePricing.baseSubtotal,
        discountTotal: activePricing.packageDiscountTotal,
        promoDiscount: activePricing.promoDiscount,
        promoCodeApplied: activePricing.promoCodeValid ? bookingDraft.promoCode.trim().toUpperCase() : undefined,
        serviceFee: activePricing.serviceFee,
        totalAmount: activePricing.totalAmount,
        specialRequest: bookingDraft.specialRequest.trim(),
        paymentMethodId: chosenPayment.id,
        paymentMethodName: chosenPayment.name,
        tripCategory: 'upcoming',
        bookingStatus:
          chosenPayment.type === 'pay_at_office'
            ? 'Confirmed - Reservation Hold'
            : 'Awaiting Payment Verification',
        paymentStatus: 'Unpaid - Awaiting Payment'
      };

      setBookings((prev) => [newBooking, ...prev]);
      setVerifiedBookingRefs((prev) => (prev.includes(reference) ? prev : [reference, ...prev]));
      setLookupRef(reference);
      setLookupContact(guestInfo.email.trim());
      setStandalone({ type: 'confirmation', bookingReference: reference });
      showToast(`Booking ${reference} created successfully.`, 'success');
    } catch {
      showToast('Unable to process booking request. Please try again.', 'error');
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  const handleCancelBooking = (bookingReference: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.bookingReference === bookingReference
          ? {
              ...b,
              tripCategory: 'cancelled',
              bookingStatus: 'Cancelled',
              paymentStatus: 'Cancelled'
            }
          : b
      )
    );
    showToast(`Booking ${bookingReference} has been cancelled.`, 'info');
  };

  const handleLookupBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError('');
    const refInput = lookupRef.trim().toUpperCase();
    const contactInput = lookupContact.trim().toLowerCase();

    if (!refInput || !contactInput) {
      setLookupError('Please enter both your Booking Reference and registered Email or Phone number.');
      return;
    }

    const found = bookings.find((b) => {
      const refMatches = b.bookingReference.toUpperCase() === refInput;
      const emailMatches = b.guest.email.toLowerCase() === contactInput;
      const phoneClean = b.guest.phone.replace(/[\s\-()+]/g, '');
      const inputPhoneClean = contactInput.replace(/[\s\-()+]/g, '');
      const phoneMatches = inputPhoneClean.length >= 6 && phoneClean === inputPhoneClean;
      return refMatches && (emailMatches || phoneMatches);
    });

    if (!found) {
      setLookupError(
        'No matching booking found. Verify your Booking Reference and the Email or Phone number used during guest checkout.'
      );
      return;
    }

    setVerifiedBookingRefs((prev) =>
      prev.includes(found.bookingReference) ? prev : [found.bookingReference, ...prev]
    );
    setTripSubTab(found.tripCategory);
    showToast('Booking verified and unlocked.', 'success');
  };

  // ============================================================================
  // 7. STANDALONE PAGES RENDERERS
  // ============================================================================

  const renderStandaloneHeader = (title: string, onBack: () => void, rightSlot?: React.ReactNode) => (
    <>
      {renderGlobalHeader()}
      <header className="app-header px-3.5 py-3 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back"
          className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center hover:bg-slate-200 active:scale-95 transition shrink-0"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-[15px] font-bold text-slate-900 truncate flex-1 text-center">{title}</h1>
        <div className="min-w-[36px] flex justify-end shrink-0">{rightSlot}</div>
      </header>
    </>
  );

  // DESTINATION DETAIL PAGE
  const renderDestinationPage = (destinationId: string) => {
    const dest = getDestinationById(destinationId);
    if (!dest) {
      return (
        <div className="app-shell">
          {renderStandaloneHeader('Destination', () => setStandalone(null))}
          <div className="app-content p-4">
            <EmptyState
              icon={<MapPin className="w-6 h-6" />}
              title="Destination Not Found"
              description="The destination you requested could not be loaded."
              actionLabel="Back to Explore"
              onAction={() => {
                setStandalone(null);
                setActiveTab('explore');
              }}
            />
          </div>
        </div>
      );
    }

    const relatedPackages = getPackagesByDestination(dest.id);
    const otherDestinations = getOtherDestinations(dest.id);

    return (
      <div className="app-shell">
        {renderStandaloneHeader(dest.name, () => setStandalone(null))}
        <div className="app-content pb-8">
          <div className="relative h-56 w-full bg-slate-800">
            <img src={dest.heroImage} alt={dest.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/25 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <Badge variant="accent" className="mb-1.5">
                {dest.country} • {dest.region}
              </Badge>
              <h2 className="text-xl font-extrabold leading-tight">{dest.name}</h2>
              <p className="text-xs text-slate-200 mt-0.5">{dest.tagline}</p>
            </div>
          </div>

          <div className="p-4 space-y-5">
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">About {dest.name}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{dest.description}</p>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Essential Travel Information</h3>
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Best Season</div>
                  <div className="font-bold text-slate-800 mt-0.5">{dest.bestTimeToVisit}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Currency</div>
                  <div className="font-bold text-slate-800 mt-0.5">{dest.currency}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Language</div>
                  <div className="font-bold text-slate-800 mt-0.5">{dest.language}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Timezone</div>
                  <div className="font-bold text-slate-800 mt-0.5">{dest.timezone}</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-2.5">Destination Gallery</h3>
              <div className="flex gap-2.5 overflow-x-auto no-scrollbar">
                {dest.gallery.map((imgUrl, idx) => (
                  <img
                    key={idx}
                    src={imgUrl}
                    alt={`${dest.name} view ${idx + 1}`}
                    className="w-40 h-28 rounded-xl object-cover shrink-0 border border-slate-200"
                  />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Popular Attractions</h3>
              {dest.popularAttractions.map((attr, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-900">{attr.name}</span>
                    <Badge variant="ocean">{attr.category}</Badge>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{attr.description}</p>
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-2.5">
                Available Tour Packages ({relatedPackages.length})
              </h3>
              <div className="space-y-3">
                {relatedPackages.map((pkg) => (
                  <PackageCard
                    key={pkg.id}
                    pkg={pkg}
                    onSelect={openPackageDetail}
                    isWishlisted={wishlistIds.includes(pkg.id)}
                    onToggleWishlist={toggleWishlist}
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-2.5">Explore Other Destinations</h3>
              <div className="flex gap-2.5 overflow-x-auto no-scrollbar">
                {otherDestinations.map((other) => (
                  <button
                    key={other.id}
                    type="button"
                    onClick={() => openDestinationDetail(other.id)}
                    className="w-36 shrink-0 rounded-xl overflow-hidden bg-white border border-slate-200 text-left shadow-xs"
                  >
                    <img src={other.heroImage} alt={other.name} className="w-full h-20 object-cover" />
                    <div className="p-2">
                      <div className="text-xs font-bold text-slate-900 truncate">{other.name}</div>
                      <div className="text-[10px] text-slate-500">{other.country}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // TOUR DETAILS PAGE
  const renderPackageDetailPage = (packageId: string) => {
    const pkg = getPackageById(packageId);
    if (!pkg) {
      return (
        <div className="app-shell">
          {renderStandaloneHeader('Tour Details', () => setStandalone(null))}
          <div className="app-content p-4">
            <EmptyState
              icon={<Briefcase className="w-6 h-6" />}
              title="Tour Package Not Found"
              description="This travel package is unavailable or has been removed."
              actionLabel="Browse Packages"
              onAction={() => {
                setStandalone(null);
                setActiveTab('explore');
              }}
            />
          </div>
        </div>
      );
    }

    const effectivePrice = pkg.discountPrice ?? pkg.price;
    const hasDiscount = typeof pkg.discountPrice === 'number' && pkg.discountPrice < pkg.price;
    const safeImgIdx = Math.min(galleryIndex, pkg.images.length - 1);
    const isWishlisted = wishlistIds.includes(pkg.id);

    return (
      <div className="app-shell">
        {renderStandaloneHeader(
          'Tour Details',
          () => setStandalone(null),
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => toggleWishlist(pkg.id)}
              aria-label="Toggle wishlist"
              className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
            <button
              type="button"
              onClick={() => showToast('Tour link copied to clipboard.', 'success')}
              aria-label="Share tour"
              className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="app-content pb-6">
          {/* Image Gallery */}
          <div className="relative h-60 w-full bg-slate-900">
            <img
              src={pkg.images[safeImgIdx]}
              alt={`${pkg.name} ${safeImgIdx + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <div className="flex gap-1.5 bg-black/50 backdrop-blur-xs px-2.5 py-1.5 rounded-full">
                {pkg.images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setGalleryIndex(i)}
                    aria-label={`View photo ${i + 1}`}
                    className={`h-2 rounded-full transition-all ${
                      i === safeImgIdx ? 'w-5 bg-white' : 'w-2 bg-white/50'
                    }`}
                  />
                ))}
              </div>
              <span className="px-2.5 py-1 rounded-full bg-black/60 text-white text-[11px] font-semibold">
                {safeImgIdx + 1} / {pkg.images.length}
              </span>
            </div>
          </div>

          {pkg.images.length > 1 && (
            <div className="flex gap-2 px-4 pt-3 overflow-x-auto no-scrollbar">
              {pkg.images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setGalleryIndex(i)}
                  className={`w-16 h-12 rounded-lg overflow-hidden border-2 shrink-0 transition ${
                    i === safeImgIdx ? 'border-[#0B2545]' : 'border-transparent opacity-70'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="p-4 space-y-4">
            {/* Title, Destination, Rating, Description */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <Badge variant="ocean">{pkg.category}</Badge>
                <div className="inline-flex items-center gap-1 text-xs font-bold text-slate-800">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{pkg.rating.toFixed(1)}</span>
                  <span className="text-slate-400 font-normal">({pkg.reviewCount} reviews)</span>
                </div>
              </div>

              <h2 className="text-lg font-extrabold text-slate-900 leading-snug mb-1.5">{pkg.name}</h2>

              <button
                type="button"
                onClick={() => openDestinationDetail(pkg.destinationId)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#136F99] mb-3"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>{pkg.destination}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <p className="text-xs text-slate-600 leading-relaxed">{pkg.description}</p>

              <div className="grid grid-cols-2 gap-2.5 mt-3.5 pt-3.5 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#E7F3F8] text-[#136F99] flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Duration</div>
                    <div className="font-bold text-slate-800">{pkg.duration}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#E7F3F8] text-[#136F99] flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Availability</div>
                    <div className="font-bold text-emerald-700">{pkg.availability} Seats Left</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Highlights */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-2.5">Experience Highlights</h3>
              <ul className="space-y-2">
                {pkg.highlights.map((hl, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                    <Sparkles className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Meeting Point & Departure Dates */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#136F99]" />
                <span>Departure Dates & Meeting Point</span>
              </h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {pkg.departureDates.map((dateStr) => (
                  <span
                    key={dateStr}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700"
                  >
                    {formatDateReadable(dateStr)}
                  </span>
                ))}
              </div>
              <div className="text-[11px] text-slate-500 space-y-1 bg-slate-50 p-2.5 rounded-xl">
                <div>
                  <strong className="text-slate-700">Departure:</strong> {pkg.departureLocation}
                </div>
                <div>
                  <strong className="text-slate-700">Meeting Point:</strong> {pkg.meetingPoint}
                </div>
              </div>
            </div>

            {/* Itinerary */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Day-by-Day Itinerary</h3>
              <div className="space-y-3.5 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E7F3F8]">
                {pkg.itinerary.map((item) => (
                  <div key={item.day} className="relative pl-8">
                    <div className="absolute left-0 top-0.5 w-6 h-6 rounded-full bg-[#0B2545] text-white text-[11px] font-bold flex items-center justify-center">
                      {item.day}
                    </div>
                    <div className="text-xs font-bold text-slate-900 mb-1">
                      Day {item.day}: {item.title}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mb-1.5">{item.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {item.meals && item.meals.length > 0 && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-amber-50 text-amber-800">
                          <Utensils className="w-2.5 h-2.5" />
                          {item.meals.join(', ')}
                        </span>
                      )}
                      {item.accommodation && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          <Hotel className="w-2.5 h-2.5" />
                          {item.accommodation}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Included & Excluded Services */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">Included Services</h3>
                <ul className="space-y-1.5">
                  {pkg.inclusions.map((inc, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-3 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 mb-2">Excluded Services</h3>
                <ul className="space-y-1.5">
                  {pkg.exclusions.map((exc, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                      <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <span>{exc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Important Information & Cancellation Policy */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1.5">Important Information</h3>
                <ul className="list-disc pl-4 space-y-1 text-xs text-slate-600">
                  {pkg.importantNotes.map((note, i) => (
                    <li key={i}>{note}</li>
                  ))}
                </ul>
              </div>
              <div className="pt-3 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 mb-1.5">Cancellation Policy</h3>
                <ul className="list-disc pl-4 space-y-1 text-xs text-slate-600">
                  {pkg.cancellationPolicy.map((pol, i) => (
                    <li key={i}>{pol}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Customer Reviews */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Customer Reviews</h3>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#0B2545]">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {pkg.rating.toFixed(1)} ({pkg.reviewCount})
                </span>
              </div>
              <div className="space-y-2.5">
                {pkg.reviews.map((rev) => (
                  <div key={rev.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900">{rev.author}</span>
                      <span className="text-[10px] text-slate-400">{rev.date}</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-amber-400 mb-1.5">
                      {Array.from({ length: rev.rating }).map((_, idx) => (
                        <Star key={idx} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-slate-600 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Booking CTA */}
        <div className="bottom-action-bar flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Price per adult</div>
            {hasDiscount && (
              <div className="text-[11px] text-slate-400 line-through leading-none">{formatIDR(pkg.price)}</div>
            )}
            <div className="text-base font-extrabold text-[#0B2545]">{formatIDR(effectivePrice)}</div>
          </div>
          <button
            type="button"
            onClick={() => startBookingForPackage(pkg.id)}
            className="px-6 py-3 rounded-xl bg-[#0B2545] text-white text-sm font-bold shadow-md hover:bg-[#06172D] active:scale-[0.98] transition"
          >
            Book Now
          </button>
        </div>
      </div>
    );
  };

  // BOOKING SYSTEM PAGE
  const renderBookingPage = (packageId: string) => {
    const pkg = getPackageById(packageId) || activeBookingPackage;
    const totalSeats = bookingDraft.adults + bookingDraft.children;
    const isCountValid =
      totalSeats >= pkg.minTravelers && totalSeats <= pkg.maxTravelers && Boolean(bookingDraft.departureDate);

    return (
      <div className="app-shell">
        {renderStandaloneHeader('Configure Booking', () =>
          setStandalone({ type: 'package', packageId: pkg.id })
        )}

        <div className="app-content p-4 space-y-4 pb-8">
          {/* Selected Package Card */}
          <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs flex gap-3">
            <img src={pkg.images[0]} alt={pkg.name} className="w-20 h-20 rounded-xl object-cover shrink-0" />
            <div className="min-w-0 flex-1">
              <Badge variant="ocean" className="mb-1">
                {pkg.category}
              </Badge>
              <h2 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">{pkg.name}</h2>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                <span>{pkg.destination}</span>
                <span>•</span>
                <span>{pkg.duration}</span>
              </div>
            </div>
          </div>

          {/* Select Package Options */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-2.5">
            <h3 className="text-sm font-bold text-slate-900">Select Package Option</h3>
            {pkg.packageOptions.map((opt) => {
              const selected = bookingDraft.optionId === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setBookingDraft((prev) => ({ ...prev, optionId: opt.id }))}
                  className={`w-full p-3 rounded-xl border text-left transition flex items-start justify-between gap-2 ${
                    selected
                      ? 'border-[#136F99] bg-[#E7F3F8]/70'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900">{opt.name}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{opt.description}</div>
                    <div className="text-[11px] font-bold text-[#136F99] mt-1">
                      {opt.priceDelta === 0 ? 'Included in base fare' : `+${formatIDR(opt.priceDelta)} / adult`}
                    </div>
                  </div>
                  {selected && <CheckCircle2 className="w-4 h-4 text-[#136F99] shrink-0 mt-0.5" />}
                </button>
              );
            })}
          </div>

          {/* Departure Date Selector */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
            <label className="block text-sm font-bold text-slate-900 mb-1">
              Select Travel Date <span className="text-rose-500">*</span>
            </label>
            <p className="text-xs text-slate-500 mb-3">Choose an available scheduled departure date.</p>
            <div className="grid grid-cols-2 gap-2">
              {pkg.departureDates.map((dateStr) => {
                const isSelected = bookingDraft.departureDate === dateStr;
                return (
                  <button
                    key={dateStr}
                    type="button"
                    onClick={() => setBookingDraft((prev) => ({ ...prev, departureDate: dateStr }))}
                    className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${
                      isSelected
                        ? 'border-[#136F99] bg-[#E7F3F8] text-[#0B2545]'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">{formatDateReadable(dateStr)}</div>
                      <div className="text-[10px] opacity-75">
                        Ends {calculateReturnDate(dateStr, pkg.durationDays)}
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-[#136F99] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Participant Counters */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Number of Participants</h3>
                <p className="text-[11px] text-slate-500">
                  Min. {pkg.minTravelers} – Max. {pkg.maxTravelers} seats per booking
                </p>
              </div>
              <Badge variant="neutral">{activePricing.totalTravelers} Pax</Badge>
            </div>

            <div className="flex items-center justify-between py-2 border-t border-slate-100">
              <div>
                <div className="text-xs font-bold text-slate-900">Adults (12+ yrs)</div>
                <div className="text-[11px] text-[#136F99] font-semibold">
                  {formatIDR(activePricing.adultUnitPrice)} / pax
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    updateTravelerCounts(bookingDraft.adults - 1, bookingDraft.children, bookingDraft.infants)
                  }
                  disabled={bookingDraft.adults <= 1}
                  aria-label="Decrease adults"
                  className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-700 disabled:opacity-40"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-6 text-center text-sm font-bold text-slate-900">{bookingDraft.adults}</span>
                <button
                  type="button"
                  onClick={() =>
                    updateTravelerCounts(bookingDraft.adults + 1, bookingDraft.children, bookingDraft.infants)
                  }
                  disabled={bookingDraft.adults + bookingDraft.children >= pkg.maxTravelers}
                  aria-label="Increase adults"
                  className="w-9 h-9 rounded-xl bg-[#0B2545] text-white flex items-center justify-center disabled:opacity-40"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between py-2 border-t border-slate-100">
              <div>
                <div className="text-xs font-bold text-slate-900">Children (2–11 yrs)</div>
                <div className="text-[11px] text-[#136F99] font-semibold">
                  {formatIDR(activePricing.childUnitPrice)} / pax
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    updateTravelerCounts(bookingDraft.adults, bookingDraft.children - 1, bookingDraft.infants)
                  }
                  disabled={bookingDraft.children <= 0}
                  aria-label="Decrease children"
                  className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-700 disabled:opacity-40"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-6 text-center text-sm font-bold text-slate-900">{bookingDraft.children}</span>
                <button
                  type="button"
                  onClick={() =>
                    updateTravelerCounts(bookingDraft.adults, bookingDraft.children + 1, bookingDraft.infants)
                  }
                  disabled={bookingDraft.adults + bookingDraft.children >= pkg.maxTravelers}
                  aria-label="Increase children"
                  className="w-9 h-9 rounded-xl bg-[#0B2545] text-white flex items-center justify-center disabled:opacity-40"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between py-2 border-t border-slate-100">
              <div>
                <div className="text-xs font-bold text-slate-900">Infants (Under 2 yrs)</div>
                <div className="text-[11px] text-[#136F99] font-semibold">
                  {formatIDR(activePricing.infantUnitPrice)} / pax
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    updateTravelerCounts(bookingDraft.adults, bookingDraft.children, bookingDraft.infants - 1)
                  }
                  disabled={bookingDraft.infants <= 0}
                  aria-label="Decrease infants"
                  className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-700 disabled:opacity-40"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-6 text-center text-sm font-bold text-slate-900">{bookingDraft.infants}</span>
                <button
                  type="button"
                  onClick={() =>
                    updateTravelerCounts(bookingDraft.adults, bookingDraft.children, bookingDraft.infants + 1)
                  }
                  disabled={bookingDraft.infants >= bookingDraft.adults}
                  aria-label="Increase infants"
                  className="w-9 h-9 rounded-xl bg-[#0B2545] text-white flex items-center justify-center disabled:opacity-40"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {totalSeats < pkg.minTravelers && (
              <AlertBanner type="warning">
                This package requires a minimum of <strong>{pkg.minTravelers} travelers</strong> (Adults + Children).
                Please add {pkg.minTravelers - totalSeats} more traveler(s).
              </AlertBanner>
            )}
          </div>

          {/* Apply Discount Code */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-2">
            <label htmlFor="booking-promo" className="block text-sm font-bold text-slate-900">
              Promo / Discount Code
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="booking-promo"
                  type="text"
                  value={bookingDraft.promoCode}
                  onChange={(e) => setBookingDraft((prev) => ({ ...prev, promoCode: e.target.value.toUpperCase() }))}
                  placeholder="Try ASRIVA250 or BEYOND500"
                  className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2.5 text-xs font-semibold uppercase text-slate-900 focus:outline-none focus:border-[#136F99]"
                />
              </div>
              {bookingDraft.promoCode && (
                <button
                  type="button"
                  onClick={() => setBookingDraft((prev) => ({ ...prev, promoCode: '' }))}
                  className="px-3 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>
            {bookingDraft.promoCode.trim() !== '' && (
              <p
                className={`text-[11px] font-semibold ${
                  activePricing.promoCodeValid ? 'text-emerald-700' : 'text-amber-700'
                }`}
              >
                {activePricing.promoCodeValid
                  ? `Applied: ${activePricing.promoLabel}`
                  : 'Code requires minimum spend or is not recognized (Available: ASRIVA250, BEYOND500).'}
              </p>
            )}
          </div>

          {/* Special Request */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
            <label htmlFor="booking-special-req" className="block text-sm font-bold text-slate-900 mb-1">
              Special Request (Optional)
            </label>
            <textarea
              id="booking-special-req"
              rows={2}
              value={bookingDraft.specialRequest}
              onChange={(e) => setBookingDraft((prev) => ({ ...prev, specialRequest: e.target.value }))}
              placeholder="Dietary preferences, room bedding arrangement, or accessibility assistance..."
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#136F99]"
            />
          </div>

          {/* Booking Price Summary */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-2 text-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Booking Summary & Fare</h3>
            <div className="flex justify-between text-slate-600">
              <span>
                Adults ({bookingDraft.adults} × {formatIDR(activePricing.adultUnitPrice)})
              </span>
              <span className="font-semibold text-slate-900">{formatIDR(activePricing.adultsTotal)}</span>
            </div>
            {bookingDraft.children > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>
                  Children ({bookingDraft.children} × {formatIDR(activePricing.childUnitPrice)})
                </span>
                <span className="font-semibold text-slate-900">{formatIDR(activePricing.childrenTotal)}</span>
              </div>
            )}
            {bookingDraft.infants > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>
                  Infants ({bookingDraft.infants} × {formatIDR(activePricing.infantUnitPrice)})
                </span>
                <span className="font-semibold text-slate-900">{formatIDR(activePricing.infantsTotal)}</span>
              </div>
            )}
            {activePricing.packageDiscountTotal > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Promotional Package Savings</span>
                <span className="font-semibold">-{formatIDR(activePricing.packageDiscountTotal)}</span>
              </div>
            )}
            {activePricing.promoDiscount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Promo Code ({bookingDraft.promoCode.trim().toUpperCase()})</span>
                <span className="font-semibold">-{formatIDR(activePricing.promoDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Booking Service & Admin Fee</span>
              <span className="font-semibold text-slate-900">{formatIDR(activePricing.serviceFee)}</span>
            </div>
            <div className="pt-2.5 border-t border-slate-100 flex justify-between items-center">
              <span className="text-sm font-bold text-slate-900">Total Payment</span>
              <span className="text-base font-extrabold text-[#0B2545]">{formatIDR(activePricing.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Sticky Bottom Action */}
        <div className="bottom-action-bar flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-semibold uppercase text-slate-400">
              Total ({activePricing.totalTravelers} Pax)
            </div>
            <div className="text-base font-extrabold text-[#0B2545]">{formatIDR(activePricing.totalAmount)}</div>
          </div>
          <button
            type="button"
            disabled={!isCountValid}
            onClick={handleProceedToCheckout}
            className="px-6 py-3 rounded-xl bg-[#0B2545] text-white text-sm font-bold shadow-md hover:bg-[#06172D] disabled:opacity-45 disabled:cursor-not-allowed active:scale-[0.98] transition inline-flex items-center gap-1.5"
          >
            <span>Continue</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  // GUEST CHECKOUT PAGE
  const renderCheckoutPage = () => {
    const pkg = activeBookingPackage;
    const chosenOption =
      pkg.packageOptions.find((o) => o.id === bookingDraft.optionId) || pkg.packageOptions[0];
    const returnDate = calculateReturnDate(bookingDraft.departureDate, pkg.durationDays);

    return (
      <div className="app-shell">
        {renderStandaloneHeader(
          'Guest Checkout',
          () => setStandalone({ type: 'booking', packageId: pkg.id }),
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            Guest
          </span>
        )}

        <div className="app-content p-4 space-y-4 pb-8">
          <AlertBanner type="info" title="No Account or Login Required">
            Complete your reservation directly as a guest. Your Booking Reference and itinerary confirmation will be
            issued immediately upon submission.
          </AlertBanner>

          {/* Booking Summary */}
          <section className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Booking Summary</h2>
            <div className="flex gap-3 pb-3 border-b border-slate-100">
              <img src={pkg.images[0]} alt={pkg.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-slate-900 leading-snug">{pkg.name}</div>
                <div className="text-[11px] font-semibold text-[#136F99] mt-0.5">{chosenOption.name}</div>
                <div className="text-xs text-slate-500 mt-0.5">{pkg.destination}</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-3 text-xs">
              <div>
                <div className="text-[10px] text-slate-400">Departure</div>
                <div className="font-bold text-slate-800">{formatDateReadable(bookingDraft.departureDate)}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Return</div>
                <div className="font-bold text-slate-800">{returnDate}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Travelers</div>
                <div className="font-bold text-slate-800">
                  {bookingDraft.adults}A
                  {bookingDraft.children > 0 ? `, ${bookingDraft.children}C` : ''}
                  {bookingDraft.infants > 0 ? `, ${bookingDraft.infants}I` : ''}
                </div>
              </div>
            </div>
          </section>

          {/* Contact Person (Guest Information) */}
          <section className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Contact Person (Guest Information)</h2>
              <p className="text-xs text-slate-500">
                Used to send your booking confirmation and verify your reservation in My Trips.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={guestInfo.fullName}
                onChange={(e) => {
                  setGuestInfo((prev) => ({ ...prev, fullName: e.target.value }));
                  if (formErrors.guestFullName) setFormErrors((prev) => ({ ...prev, guestFullName: '' }));
                }}
                placeholder="e.g., Budi Santoso"
                className={`w-full rounded-xl border px-3 py-2.5 text-xs text-slate-900 focus:outline-none ${
                  formErrors.guestFullName ? 'border-rose-500 bg-rose-50/30' : 'border-slate-200 focus:border-[#136F99]'
                }`}
              />
              {formErrors.guestFullName && (
                <p className="text-[11px] text-rose-600 mt-1">{formErrors.guestFullName}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                value={guestInfo.email}
                onChange={(e) => {
                  setGuestInfo((prev) => ({ ...prev, email: e.target.value }));
                  if (formErrors.guestEmail) setFormErrors((prev) => ({ ...prev, guestEmail: '' }));
                }}
                placeholder="name@example.com"
                className={`w-full rounded-xl border px-3 py-2.5 text-xs text-slate-900 focus:outline-none ${
                  formErrors.guestEmail ? 'border-rose-500 bg-rose-50/30' : 'border-slate-200 focus:border-[#136F99]'
                }`}
              />
              {formErrors.guestEmail && <p className="text-[11px] text-rose-600 mt-1">{formErrors.guestEmail}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                value={guestInfo.phone}
                onChange={(e) => {
                  setGuestInfo((prev) => ({ ...prev, phone: e.target.value }));
                  if (formErrors.guestPhone) setFormErrors((prev) => ({ ...prev, guestPhone: '' }));
                }}
                placeholder="e.g., 081234567890"
                className={`w-full rounded-xl border px-3 py-2.5 text-xs text-slate-900 focus:outline-none ${
                  formErrors.guestPhone ? 'border-rose-500 bg-rose-50/30' : 'border-slate-200 focus:border-[#136F99]'
                }`}
              />
              {formErrors.guestPhone && <p className="text-[11px] text-rose-600 mt-1">{formErrors.guestPhone}</p>}
            </div>

            <div className="pt-1">
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer mb-2">
                <input
                  type="checkbox"
                  checked={sameWhatsappAsPhone}
                  onChange={(e) => setSameWhatsappAsPhone(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 accent-[#0B2545]"
                />
                <span>WhatsApp number is the same as Phone Number</span>
              </label>

              {!sameWhatsappAsPhone && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp Number</label>
                  <input
                    type="tel"
                    value={guestInfo.whatsapp}
                    onChange={(e) => setGuestInfo((prev) => ({ ...prev, whatsapp: e.target.value }))}
                    placeholder="e.g., 081234567890"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#136F99]"
                  />
                  {formErrors.guestWhatsapp && (
                    <p className="text-[11px] text-rose-600 mt-1">{formErrors.guestWhatsapp}</p>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Traveler Information */}
          <section className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3.5">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Traveler Information ({bookingDraft.travelers.length} Participants)
              </h2>
              <p className="text-xs text-slate-500">Enter participant names as shown on ID card or passport.</p>
            </div>

            {bookingDraft.travelers.length > 0 && bookingDraft.travelers[0].type === 'Adult' && (
              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#E7F3F8]/80 border border-[#BAE6FD] text-xs font-semibold text-[#0B2545] cursor-pointer">
                <input
                  type="checkbox"
                  checked={contactIsMainTraveler}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setContactIsMainTraveler(checked);
                    if (checked) {
                      setBookingDraft((prev) => {
                        const copy = [...prev.travelers];
                        if (copy[0]) copy[0] = { ...copy[0], fullName: guestInfo.fullName };
                        return { ...prev, travelers: copy };
                      });
                    }
                  }}
                  className="w-4 h-4 rounded accent-[#0B2545]"
                />
                <span>Contact Person is the Main Traveler</span>
              </label>
            )}

            <div className="space-y-3">
              {bookingDraft.travelers.map((traveler, index) => {
                const isLockedByContact = index === 0 && contactIsMainTraveler;
                const nameErr = formErrors[`traveler_${index}_name`];
                const genderErr = formErrors[`traveler_${index}_gender`];

                return (
                  <div key={traveler.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">
                        Traveler #{index + 1} ({traveler.type})
                      </span>
                      {index === 0 && <Badge variant="navy">Lead Traveler</Badge>}
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={traveler.fullName}
                        disabled={isLockedByContact}
                        onChange={(e) => {
                          const val = e.target.value;
                          setBookingDraft((prev) => {
                            const updated = [...prev.travelers];
                            updated[index] = { ...updated[index], fullName: val };
                            return { ...prev, travelers: updated };
                          });
                          if (nameErr) setFormErrors((prev) => ({ ...prev, [`traveler_${index}_name`]: '' }));
                        }}
                        placeholder="Full legal name"
                        className={`w-full rounded-xl border px-3 py-2 text-xs bg-white text-slate-900 disabled:bg-slate-100 disabled:text-slate-600 focus:outline-none ${
                          nameErr ? 'border-rose-500' : 'border-slate-200 focus:border-[#136F99]'
                        }`}
                      />
                      {nameErr && <p className="text-[11px] text-rose-600 mt-0.5">{nameErr}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Gender <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={traveler.gender}
                          onChange={(e) => {
                            const val = e.target.value as 'Male' | 'Female' | '';
                            setBookingDraft((prev) => {
                              const updated = [...prev.travelers];
                              updated[index] = { ...updated[index], gender: val };
                              return { ...prev, travelers: updated };
                            });
                            if (genderErr) setFormErrors((prev) => ({ ...prev, [`traveler_${index}_gender`]: '' }));
                          }}
                          className={`w-full rounded-xl border px-2.5 py-2 text-xs bg-white text-slate-900 focus:outline-none ${
                            genderErr ? 'border-rose-500' : 'border-slate-200 focus:border-[#136F99]'
                          }`}
                        >
                          <option value="">Select</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                        {genderErr && <p className="text-[11px] text-rose-600 mt-0.5">{genderErr}</p>}
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Date of Birth</label>
                        <input
                          type="date"
                          value={traveler.dateOfBirth}
                          onChange={(e) => {
                            const val = e.target.value;
                            setBookingDraft((prev) => {
                              const updated = [...prev.travelers];
                              updated[index] = { ...updated[index], dateOfBirth: val };
                              return { ...prev, travelers: updated };
                            });
                          }}
                          className="w-full rounded-xl border border-slate-200 px-2.5 py-2 text-xs bg-white text-slate-900 focus:outline-none focus:border-[#136F99]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        KTP / Passport Number (Optional)
                      </label>
                      <input
                        type="text"
                        value={traveler.identityNumber}
                        onChange={(e) => {
                          const val = e.target.value;
                          setBookingDraft((prev) => {
                            const updated = [...prev.travelers];
                            updated[index] = { ...updated[index], identityNumber: val };
                            return { ...prev, travelers: updated };
                          });
                        }}
                        placeholder="Identity or passport number"
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white text-slate-900 focus:outline-none focus:border-[#136F99]"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Payment Method Selection */}
          <section className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Payment Method & Settlement</h2>
              <p className="text-xs text-slate-500">
                Select how you will settle this reservation. Bookings remain marked as Unpaid until verified.
              </p>
            </div>

            <div className="space-y-2.5">
              {PAYMENT_CHANNELS.map((channel) => {
                const isSelected = selectedPaymentId === channel.id;
                return (
                  <div
                    key={channel.id}
                    onClick={() => {
                      if (!channel.available) {
                        showToast('Automated payment gateway is not connected in this environment.', 'warning');
                        return;
                      }
                      setSelectedPaymentId(channel.id);
                    }}
                    className={`p-3.5 rounded-xl border transition ${
                      !channel.available
                        ? 'border-slate-200 bg-slate-50 opacity-75 cursor-not-allowed'
                        : isSelected
                        ? 'border-[#136F99] bg-[#E7F3F8]/70 cursor-pointer'
                        : 'border-slate-200 bg-white hover:border-slate-300 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected && channel.available ? 'border-[#136F99]' : 'border-slate-300'
                          }`}
                        >
                          {isSelected && channel.available && (
                            <div className="w-2 h-2 rounded-full bg-[#136F99]" />
                          )}
                        </div>
                        <span className="text-xs font-bold text-slate-900">{channel.name}</span>
                      </div>
                      <Badge variant={channel.available ? 'warning' : 'neutral'}>{channel.statusLabel}</Badge>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed pl-6">{channel.description}</p>
                  </div>
                );
              })}
            </div>
            {formErrors.paymentMethod && <p className="text-[11px] text-rose-600">{formErrors.paymentMethod}</p>}
          </section>

          {/* Price Breakdown */}
          <section className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-2 text-xs">
            <h2 className="text-sm font-bold text-slate-900 mb-2">Price Breakdown</h2>
            <div className="flex justify-between text-slate-600">
              <span>Package Base Fare ({activePricing.totalTravelers} Travelers)</span>
              <span className="font-semibold text-slate-900">{formatIDR(activePricing.baseSubtotal)}</span>
            </div>
            {activePricing.packageDiscountTotal > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Package Discount</span>
                <span className="font-semibold">-{formatIDR(activePricing.packageDiscountTotal)}</span>
              </div>
            )}
            {activePricing.promoDiscount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Promo Code ({bookingDraft.promoCode.trim().toUpperCase()})</span>
                <span className="font-semibold">-{formatIDR(activePricing.promoDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Service & Administration Fee</span>
              <span className="font-semibold text-slate-900">{formatIDR(activePricing.serviceFee)}</span>
            </div>
            <div className="pt-2.5 border-t border-slate-100 flex justify-between items-center">
              <span className="text-sm font-bold text-slate-900">Total Payment</span>
              <span className="text-base font-extrabold text-[#0B2545]">{formatIDR(activePricing.totalAmount)}</span>
            </div>
          </section>

          {/* Terms Agreement */}
          <section className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
            <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => {
                  setAgreedTerms(e.target.checked);
                  if (formErrors.terms) setFormErrors((prev) => ({ ...prev, terms: '' }));
                }}
                className="w-4 h-4 mt-0.5 rounded accent-[#0B2545] shrink-0"
              />
              <span className="leading-relaxed">
                I agree to the{' '}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setLegalModal('terms');
                  }}
                  className="font-bold text-[#136F99] underline"
                >
                  Terms & Conditions
                </button>{' '}
                and{' '}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setLegalModal('privacy');
                  }}
                  className="font-bold text-[#136F99] underline"
                >
                  Privacy Policy
                </button>
                .
              </span>
            </label>
            {formErrors.terms && <p className="text-[11px] text-rose-600 mt-1.5">{formErrors.terms}</p>}
          </section>
        </div>

        {/* Sticky Bottom Action */}
        <div className="bottom-action-bar flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-semibold uppercase text-slate-400">Total Payment</div>
            <div className="text-base font-extrabold text-[#0B2545]">{formatIDR(activePricing.totalAmount)}</div>
          </div>
          <button
            type="button"
            disabled={isSubmittingBooking}
            onClick={handleConfirmBooking}
            className="px-5 py-3 rounded-xl bg-[#0B2545] text-white text-sm font-bold shadow-md hover:bg-[#06172D] disabled:opacity-50 active:scale-[0.98] transition inline-flex items-center gap-2"
          >
            {isSubmittingBooking ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>Confirm Booking</span>
            )}
          </button>
        </div>
      </div>
    );
  };

  // BOOKING CONFIRMATION & BOOKING DETAIL PAGE
  const renderBookingResultPage = (bookingReference: string, isConfirmationScreen: boolean) => {
    const booking = bookings.find((b) => b.bookingReference === bookingReference);
    if (!booking) {
      return (
        <div className="app-shell">
          {renderStandaloneHeader('Booking Details', () => setStandalone(null))}
          <div className="app-content p-4">
            <EmptyState
              icon={<Briefcase className="w-6 h-6" />}
              title="Booking Record Unavailable"
              description="We could not locate this booking record in your current session."
              actionLabel="Go to My Trips"
              onAction={() => {
                setStandalone(null);
                setActiveTab('bookings');
              }}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="app-shell">
        {renderStandaloneHeader(
          isConfirmationScreen ? 'Booking Confirmation' : 'Trip Details',
          () => setStandalone(null)
        )}

        <div className="app-content p-4 space-y-4 pb-8">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <Badge
              variant={booking.tripCategory === 'cancelled' ? 'error' : 'success'}
              className="mb-1.5"
            >
              {booking.bookingStatus}
            </Badge>
            <h2 className="text-lg font-extrabold text-slate-900">
              {isConfirmationScreen ? 'Reservation Recorded' : 'Reservation Details'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Save your Booking Reference below to view or manage your reservation anytime in My Trips.
            </p>

            <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-dashed border-[#136F99]/40 flex items-center justify-between">
              <div className="text-left">
                <div className="text-[10px] uppercase font-bold text-slate-400">Booking Reference</div>
                <div className="text-base font-extrabold tracking-wider text-[#0B2545]">
                  {booking.bookingReference}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(booking.bookingReference);
                  showToast('Booking Reference copied!', 'success');
                }}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 inline-flex items-center gap-1 active:scale-95"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy
              </button>
            </div>
          </div>

          <AlertBanner
            type={booking.tripCategory === 'cancelled' ? 'error' : 'warning'}
            title={`Payment Status: ${booking.paymentStatus}`}
          >
            Settlement option: <strong>{booking.paymentMethodName}</strong>. Quote reference{' '}
            <strong>{booking.bookingReference}</strong> when completing settlement with ASRIVA Travel & Tours.
          </AlertBanner>

          {/* Package & Departure Summary */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3 text-xs">
            <h3 className="text-sm font-bold text-slate-900">Package & Departure Information</h3>
            <div className="flex gap-3 pb-3 border-b border-slate-100">
              <img
                src={booking.packageImage}
                alt={booking.packageName}
                className="w-16 h-16 rounded-xl object-cover shrink-0"
              />
              <div>
                <div className="font-bold text-slate-900 text-sm">{booking.packageName}</div>
                <div className="text-[11px] font-semibold text-[#136F99] mt-0.5">{booking.optionName}</div>
                <div className="text-slate-500 mt-0.5">
                  {booking.destination} • {booking.duration}
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Departure Date</span>
              <span className="font-bold text-slate-900">{formatDateReadable(booking.departureDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Traveler Count</span>
              <span className="font-bold text-slate-900">
                {booking.adults} Adult(s)
                {booking.children > 0 ? `, ${booking.children} Child(ren)` : ''}
                {booking.infants > 0 ? `, ${booking.infants} Infant(s)` : ''}
              </span>
            </div>
            <div>
              <div className="text-slate-500">Meeting Point</div>
              <div className="font-semibold text-slate-800 mt-0.5">{booking.meetingPoint}</div>
            </div>
          </div>

          {/* Guest & Travelers */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-2.5 text-xs">
            <h3 className="text-sm font-bold text-slate-900">Contact Person & Travelers</h3>
            <div className="p-2.5 rounded-xl bg-slate-50 space-y-1">
              <div className="font-bold text-slate-900">{booking.guest.fullName}</div>
              <div className="text-slate-600">{booking.guest.email}</div>
              <div className="text-slate-600">Phone: {booking.guest.phone}</div>
            </div>
            <div className="space-y-1.5 pt-1">
              {booking.travelers.map((t, idx) => (
                <div key={t.id} className="flex items-center justify-between py-1 border-b border-slate-100 last:border-0">
                  <span className="font-semibold text-slate-800">
                    {idx + 1}. {t.fullName}
                  </span>
                  <span className="text-slate-500">
                    {t.type} • {t.gender}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total Amount */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>{formatIDR(booking.subtotal)}</span>
            </div>
            {booking.discountTotal > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Package Discount</span>
                <span>-{formatIDR(booking.discountTotal)}</span>
              </div>
            )}
            {booking.promoDiscount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Promo ({booking.promoCodeApplied})</span>
                <span>-{formatIDR(booking.promoDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Service Fee</span>
              <span>{formatIDR(booking.serviceFee)}</span>
            </div>
            <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
              <span className="text-sm font-bold text-slate-900">Total Amount</span>
              <span className="text-base font-extrabold text-[#0B2545]">{formatIDR(booking.totalAmount)}</span>
            </div>
          </div>

          <div className="space-y-2.5 pt-1">
            {isConfirmationScreen && (
              <button
                type="button"
                onClick={() => setStandalone({ type: 'bookingDetail', bookingReference: booking.bookingReference })}
                className="w-full py-3 rounded-xl bg-[#0B2545] text-white text-sm font-bold shadow-xs"
              >
                View Booking Details
              </button>
            )}
            {booking.tripCategory === 'upcoming' && (
              <button
                type="button"
                onClick={() => handleCancelBooking(booking.bookingReference)}
                className="w-full py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold"
              >
                Cancel Reservation
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setStandalone(null);
                setActiveTab('home');
              }}
              className="w-full py-3 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm font-bold"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  };

  // INFO PAGES
  const renderInfoPage = (page: 'about' | 'contact' | 'help' | 'terms' | 'privacy') => {
    const titles: Record<typeof page, string> = {
      about: 'About ASRIVA Travel & Tours',
      contact: 'Contact Us',
      help: 'Help Center & FAQ',
      terms: 'Terms & Conditions',
      privacy: 'Privacy Policy'
    };

    return (
      <div className="app-shell">
        {renderStandaloneHeader(titles[page], () => setStandalone(null))}
        <div className="app-content p-4 space-y-4 pb-8 text-xs text-slate-600 leading-relaxed">
          {page === 'about' && (
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#0B2545] text-white flex items-center justify-center">
                <Plane className="w-6 h-6" />
              </div>
              <h2 className="text-base font-extrabold text-slate-900">ASRIVA TRAVEL & TOURS</h2>
              <p className="font-semibold text-[#136F99]">Discover More. Travel Beyond.</p>
              <p>
                ASRIVA Travel & Tours is a modern digital travel storefront curated to deliver seamless domestic and
                international journeys—from private island escapes and liveaboard expeditions to scenic rail tours.
              </p>
            </div>
          )}

          {page === 'contact' && (
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 space-y-3">
              <h2 className="text-base font-extrabold text-slate-900">Travel Consultation & Support</h2>
              <p>Reach our customer care team for itinerary inquiries, group quotations, or booking verification.</p>
              <div className="space-y-2.5 pt-1">
                <div className="p-3 rounded-xl bg-slate-50 flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#136F99]" />
                  <div>
                    <div className="font-bold text-slate-900">Customer Hotline</div>
                    <div>+62 21 5098 4410 (Mon–Sat, 08:30–18:00 WIB)</div>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 flex items-center gap-3">
                  <MessageCircle className="w-4 h-4 text-[#136F99]" />
                  <div>
                    <div className="font-bold text-slate-900">WhatsApp Concierge</div>
                    <div>+62 811 9088 2210</div>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#136F99]" />
                  <div>
                    <div className="font-bold text-slate-900">Reservations Email</div>
                    <div>reservations@asrivatravel.co.id</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {page === 'help' && (
            <div className="space-y-3">
              {[
                {
                  q: 'Do I need an account to book a tour package?',
                  a: 'No. ASRIVA Travel & Tours supports full Guest Checkout. Simply provide your contact details and traveler names during checkout.'
                },
                {
                  q: 'How do I check my booking after checkout?',
                  a: 'Open the My Trips tab at the bottom navigation bar and enter your Booking Reference along with the Email or Phone number used during checkout.'
                },
                {
                  q: 'When is my booking status updated to Paid?',
                  a: 'Once your transfer or counter settlement is verified by ASRIVA Finance using your Booking Reference, your payment status updates accordingly.'
                }
              ].map((faq, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-slate-200/80">
                  <div className="font-bold text-slate-900 text-sm mb-1">{faq.q}</div>
                  <p>{faq.a}</p>
                </div>
              ))}
            </div>
          )}

          {page === 'terms' && (
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 space-y-2.5">
              <h2 className="text-sm font-bold text-slate-900">1. Guest Reservations & Validity</h2>
              <p>
                All bookings submitted via ASRIVA Travel & Tours generate a unique Booking Reference. Seat availability
                is held subject to timely settlement within the stated confirmation window.
              </p>
              <h2 className="text-sm font-bold text-slate-900">2. Pricing & Inclusions</h2>
              <p>
                Prices are quoted in Indonesian Rupiah (IDR) and include services explicitly listed under each package’s
                Included Services section.
              </p>
            </div>
          )}

          {page === 'privacy' && (
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 space-y-2.5">
              <h2 className="text-sm font-bold text-slate-900">1. Data Collected for Guest Checkout</h2>
              <p>
                We collect contact person details (name, email, phone/WhatsApp) and traveler manifest information solely
                to fulfill tour reservations, hotel check-ins, transport manifests, and travel insurance.
              </p>
              <h2 className="text-sm font-bold text-slate-900">2. Verification & Access Control</h2>
              <p>
                Booking lookup requires both your Booking Reference and registered Email or Phone number to protect
                guest privacy.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ============================================================================
  // 8. MAIN TAB PAGES (INSIDE APP SHELL)
  // ============================================================================

  // HOME STOREFRONT
  // USER PROFILE PAGE
  const renderProfilePage = () => (
    <div className="p-4 space-y-4 pb-8">
      {/* Profile Photo & Guest Header */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3.5">
        <div className="w-14 h-14 rounded-2xl bg-[#0B2545] text-white flex items-center justify-center shrink-0 font-extrabold text-lg">
          {guestInfo.fullName.trim()
            ? guestInfo.fullName.trim().slice(0, 2).toUpperCase()
            : 'AS'}
        </div>
        <div className="min-w-0 flex-1">
          <Badge variant="ocean" className="mb-1">
            Guest Traveler Profile
          </Badge>
          <h2 className="text-base font-extrabold text-slate-900 truncate">
            {guestInfo.fullName.trim() || 'ASRIVA Guest Explorer'}
          </h2>
          <p className="text-xs text-slate-500 truncate">
            {guestInfo.email.trim() || 'No account registration required'}
          </p>
        </div>
      </div>

      {/* Personal & Contact Information */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Personal & Contact Information</h3>
          <p className="text-[11px] text-slate-500">Auto-fills your guest checkout form</p>
        </div>
        <div className="space-y-2.5">
          <input
            type="text"
            value={guestInfo.fullName}
            onChange={(e) => setGuestInfo((prev) => ({ ...prev, fullName: e.target.value }))}
            placeholder="Full Name"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#136F99]"
          />
          <input
            type="email"
            value={guestInfo.email}
            onChange={(e) => setGuestInfo((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="Email Address"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#136F99]"
          />
          <input
            type="tel"
            value={guestInfo.phone}
            onChange={(e) => setGuestInfo((prev) => ({ ...prev, phone: e.target.value }))}
            placeholder="Phone / WhatsApp Number"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#136F99]"
          />
        </div>
      </div>

      {/* Quick Shortcuts: Wishlist & Booking History */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => setActiveTab('wishlist')}
          className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs text-left active:scale-[0.98] transition"
        >
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-2">
            <Heart className="w-4 h-4" />
          </div>
          <div className="text-xs font-bold text-slate-900">Wishlist</div>
          <div className="text-[11px] text-slate-500">{wishlistIds.length} saved tours</div>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('bookings')}
          className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs text-left active:scale-[0.98] transition"
        >
          <div className="w-9 h-9 rounded-xl bg-[#E7F3F8] text-[#136F99] flex items-center justify-center mb-2">
            <Briefcase className="w-4 h-4" />
          </div>
          <div className="text-xs font-bold text-slate-900">Booking History</div>
          <div className="text-[11px] text-slate-500">{verifiedBookingRefs.length} verified trips</div>
        </button>
      </div>

      {/* Settings, Support & Reset Session */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {[
          { label: 'Help Center & FAQ', icon: <HelpCircle className="w-4 h-4" />, page: 'help' as const },
          { label: 'Contact Us', icon: <Headphones className="w-4 h-4" />, page: 'contact' as const },
          { label: 'About ASRIVA Travel & Tours', icon: <Building2 className="w-4 h-4" />, page: 'about' as const },
          { label: 'Terms & Conditions', icon: <FileText className="w-4 h-4" />, page: 'terms' as const },
          { label: 'Privacy Policy', icon: <ShieldCheck className="w-4 h-4" />, page: 'privacy' as const }
        ].map((item) => (
          <button
            key={item.page}
            type="button"
            onClick={() => setStandalone({ type: 'infoPage', page: item.page })}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition"
          >
            <div className="flex items-center gap-3">
              <span className="text-[#136F99]">{item.icon}</span>
              <span className="text-xs font-semibold text-slate-800">{item.label}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        ))}

        <button
          type="button"
          onClick={() => {
            setGuestInfo({ fullName: '', email: '', phone: '', whatsapp: '' });
            setVerifiedBookingRefs([]);
            showToast('Guest session data cleared.', 'info');
          }}
          className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-rose-50/50 transition text-rose-600"
        >
          <div className="flex items-center gap-3">
            <LogOut className="w-4 h-4" />
            <span className="text-xs font-bold">Clear Guest Session / Log Out</span>
          </div>
          <Settings className="w-4 h-4 opacity-50" />
        </button>
      </div>
    </div>
  );

  // ============================================================================
  // 9. ROOT RENDER (APP SHELL vs STANDALONE PAGES + GLOBAL OVERLAYS)
  // ============================================================================

  const unreadNotificationsCount = notifications.filter((n) => n.unread).length;

  // Shared brand header rendered on every primary and standalone screen.
  const renderGlobalHeader = () => (
    <header className="app-header app-global-header px-4 py-3 flex items-center justify-between">
      <button type="button" onClick={() => { setStandalone(null); setActiveTab('home'); }} className="flex items-center gap-2.5 cursor-pointer text-left" aria-label="ASRIVA Home">
        <span className="w-9 h-9 rounded-xl bg-[#0B2545] text-white flex items-center justify-center shadow-xs">
          <Plane className="w-5 h-5" />
        </span>
        <span>
          <span className="block text-sm font-black tracking-tight text-[#0B2545] leading-none">ASRIVA</span>
          <span className="block text-[10px] font-bold tracking-widest text-[#136F99] mt-0.5">TRAVEL & TOURS</span>
        </span>
      </button>

      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Notifications"
          onClick={() => {
            setNotificationModalOpen(true);
            setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
          }}
          className="relative w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-slate-200 transition"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#D97706]" />
          )}
        </button>

        <button
          type="button"
          aria-label="Profile shortcut"
          onClick={() => { setStandalone(null); setActiveTab('profile'); }}
          className="w-9 h-9 rounded-xl bg-[#E7F3F8] text-[#0B2545] flex items-center justify-center font-bold text-xs"
        >
          <User className="w-4 h-4" />
        </button>
      </div>
    </header>
  );

  const renderMainContent = () => {
    if (standalone) {
      if (standalone.type === 'destination') return renderDestinationPage(standalone.destinationId);
      if (standalone.type === 'package') return renderPackageDetailPage(standalone.packageId);
      if (standalone.type === 'booking') return renderBookingPage(standalone.packageId);
      if (standalone.type === 'checkout') return renderCheckoutPage();
      if (standalone.type === 'confirmation') return renderBookingResultPage(standalone.bookingReference, true);
      if (standalone.type === 'bookingDetail') return renderBookingResultPage(standalone.bookingReference, false);
      if (standalone.type === 'infoPage') return renderInfoPage(standalone.page);
    }

    return (
      <div className="app-shell">
        {renderGlobalHeader()}

        {/* Scrollable Active Page Content */}
        <main className="app-content">
          {activeTab === 'home' && <HomePage searchQuery={searchQuery} setSearchQuery={setSearchQuery} setActiveTab={setActiveTab} setSelectedCategory={setSelectedCategory} setStandalone={setStandalone} openDestinationDetail={openDestinationDetail} openPackageDetail={openPackageDetail} wishlistIds={wishlistIds} toggleWishlist={toggleWishlist} />}
          {activeTab === 'explore' && <ExplorePage searchQuery={searchQuery} setSearchQuery={setSearchQuery} setFilterSheetOpen={setFilterSheetOpen} activeFilterCount={activeFilterCount} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} selectedDestinationFilter={selectedDestinationFilter} setSelectedDestinationFilter={setSelectedDestinationFilter} filteredPackages={filteredPackages} sortBy={sortBy} setSortBy={setSortBy} setPriceFilter={setPriceFilter} setDurationFilter={setDurationFilter} openDestinationDetail={openDestinationDetail} openPackageDetail={openPackageDetail} wishlistIds={wishlistIds} toggleWishlist={toggleWishlist} />}
          {activeTab === 'wishlist' && <WishlistPage wishlistIds={wishlistIds} setActiveTab={setActiveTab} openPackageDetail={openPackageDetail} toggleWishlist={toggleWishlist} />}
          {activeTab === 'bookings' && <MyTripsPage bookings={bookings} verifiedBookingRefs={verifiedBookingRefs} tripSubTab={tripSubTab} setTripSubTab={setTripSubTab} setStandalone={setStandalone} lookupRef={lookupRef} setLookupRef={setLookupRef} lookupContact={lookupContact} setLookupContact={setLookupContact} lookupError={lookupError} onLookupBooking={handleLookupBooking} setActiveTab={setActiveTab} />}
          {activeTab === 'profile' && renderProfilePage()}
        </main>

        {/* 5-Menu Mobile Bottom Navigation */}
        <nav className="bottom-nav px-1.5 py-1.5 grid grid-cols-5" aria-label="Main navigation">
          {(
            [
              { id: 'home', label: 'Home', icon: Home },
              { id: 'explore', label: 'Explore', icon: Compass },
              { id: 'wishlist', label: 'Wishlist', icon: Heart },
              { id: 'bookings', label: 'My Trips', icon: Briefcase },
              { id: 'profile', label: 'Profile', icon: User }
            ] as const
          ).map((navItem) => {
            const IconComponent = navItem.icon;
            const isActive = activeTab === navItem.id;
            return (
              <button
                key={navItem.id}
                type="button"
                onClick={() => setActiveTab(navItem.id)}
                className={`py-1.5 rounded-xl flex flex-col items-center justify-center gap-1 transition ${
                  isActive ? 'text-[#0B2545] font-bold' : 'text-slate-400 font-medium hover:text-slate-600'
                }`}
              >
                <div
                  className={`px-3 py-1 rounded-full transition ${
                    isActive ? 'bg-[#E7F3F8] text-[#136F99]' : 'bg-transparent'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                </div>
                <span className="text-[10px] leading-none">{navItem.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    );
  };

  return (
    <>
      <style>{GLOBAL_STYLES}</style>

      {renderMainContent()}

      {/* Explore Filter BottomSheet */}
      <BottomSheet open={filterSheetOpen} title="Filter Tour Packages" onClose={() => setFilterSheetOpen(false)}>
        <div className="space-y-4 text-xs">
          <div>
            <div className="font-bold text-slate-900 mb-2">Price Range (per adult)</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'all', label: 'All Prices' },
                { id: 'under5m', label: 'Under IDR 5M' },
                { id: '5mto15m', label: 'IDR 5M – 15M' },
                { id: 'above15m', label: 'Above IDR 15M' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPriceFilter(opt.id as typeof priceFilter)}
                  className={`py-2.5 px-3 rounded-xl border font-semibold ${
                    priceFilter === opt.id
                      ? 'border-[#136F99] bg-[#E7F3F8] text-[#0B2545]'
                      : 'border-slate-200 text-slate-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="font-bold text-slate-900 mb-2">Duration</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'all', label: 'Any Duration' },
                { id: '1to3', label: '1 – 3 Days' },
                { id: '4to5', label: '4 – 5 Days' },
                { id: '6plus', label: '6+ Days' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setDurationFilter(opt.id as typeof durationFilter)}
                  className={`py-2.5 px-3 rounded-xl border font-semibold ${
                    durationFilter === opt.id
                      ? 'border-[#136F99] bg-[#E7F3F8] text-[#0B2545]'
                      : 'border-slate-200 text-slate-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All');
                setSelectedDestinationFilter('All');
                setPriceFilter('all');
                setDurationFilter('all');
              }}
              className="flex-1 py-3 rounded-xl border border-slate-200 font-bold text-slate-700"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => setFilterSheetOpen(false)}
              className="flex-1 py-3 rounded-xl bg-[#0B2545] text-white font-bold"
            >
              Apply Filters ({filteredPackages.length})
            </button>
          </div>
        </div>
      </BottomSheet>

      {/* Notifications Modal */}
      <ModalDialog
        open={notificationModalOpen}
        title="Notifications & Updates"
        onClose={() => setNotificationModalOpen(false)}
      >
        <div className="space-y-2.5">
          {notifications.map((n) => (
            <div key={n.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-900">{n.title}</span>
                <span className="text-[10px] text-slate-400">{n.time}</span>
              </div>
              <p className="text-slate-600">{n.message}</p>
            </div>
          ))}
        </div>
      </ModalDialog>

      {/* Legal Documents Modal */}
      <ModalDialog
        open={legalModal !== null}
        title={legalModal === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'}
        onClose={() => setLegalModal(null)}
        footer={
          <button
            type="button"
            onClick={() => {
              setAgreedTerms(true);
              setLegalModal(null);
            }}
            className="w-full py-2.5 rounded-xl bg-[#0B2545] text-white text-xs font-bold"
          >
            Accept & Close
          </button>
        }
      >
        {legalModal === 'terms' ? (
          <div className="space-y-2.5">
            <p>
              <strong>1. Guest Reservation Policy:</strong> Bookings submitted on ASRIVA Travel & Tours create a
              reservation record identified by your unique Booking Reference.
            </p>
            <p>
              <strong>2. Payment & Verification:</strong> Reservations remain in Unpaid / Awaiting Verification status
              until payment settlement is verified by ASRIVA Finance.
            </p>
            <p>
              <strong>3. Traveler Documentation:</strong> Travelers are responsible for ensuring valid identification
              (KTP or Passport with at least 6 months validity for international packages).
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            <p>
              <strong>1. Purpose of Data Collection:</strong> Contact person and participant details are used solely to
              process travel reservations, issue vouchers, and coordinate tour logistics.
            </p>
            <p>
              <strong>2. Guest Lookup Security:</strong> Access to booking details requires both the Booking Reference
              and matching Email or Phone verification.
            </p>
          </div>
        )}
      </ModalDialog>

      {/* Global Toast Stack */}
      <div className="pointer-events-none absolute top-14 left-3 right-3 z-50 flex flex-col gap-2">
        {toasts.map((toast) => {
          const styles = {
            success: 'bg-emerald-900 text-white',
            error: 'bg-rose-900 text-white',
            warning: 'bg-amber-900 text-white',
            info: 'bg-[#0B2545] text-white'
          }[toast.type];

          return (
            <div
              key={toast.id}
              className={`px-3.5 py-2.5 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2 animate-fade-in ${styles}`}
            >
              <Check className="w-4 h-4 shrink-0" />
              <span className="flex-1">{toast.message}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default App;
