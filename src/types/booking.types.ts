export interface Traveler {
  id: string;
  type: 'Adult' | 'Child' | 'Infant';
  fullName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | '';
  identityNumber: string;
  specialRequirements: string;
}

export interface BookingDraft {
  packageId: string;
  optionId: string;
  departureDate: string;
  adults: number;
  children: number;
  infants: number;
  travelers: Traveler[];
  promoCode: string;
  specialRequest: string;
}

export interface GuestInformation {
  fullName: string;
  email: string;
  phone: string;
  whatsapp: string;
}

export interface Booking {
  bookingReference: string;
  createdAt: string;
  packageId: string;
  packageName: string;
  optionName: string;
  destination: string;
  duration: string;
  packageImage: string;
  guest: GuestInformation;
  travelers: Traveler[];
  departureDate: string;
  meetingPoint: string;
  departureLocation: string;
  adults: number;
  children: number;
  infants: number;
  subtotal: number;
  discountTotal: number;
  promoDiscount: number;
  promoCodeApplied?: string;
  serviceFee: number;
  totalAmount: number;
  specialRequest?: string;
  paymentMethodId: string;
  paymentMethodName: string;
  tripCategory: 'upcoming' | 'completed' | 'cancelled';
  bookingStatus:
    | 'Awaiting Payment Verification'
    | 'Confirmed - Reservation Hold'
    | 'Completed'
    | 'Cancelled';
  paymentStatus: 'Unpaid - Awaiting Payment' | 'Paid (Verified)' | 'Cancelled';
}
