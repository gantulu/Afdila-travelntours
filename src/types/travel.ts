import type { LucideIcon } from 'lucide-react';

export type CategoryId = 'all' | 'beach' | 'mountain' | 'culture' | 'island' | 'culinary';
export type TourCategory = Exclude<CategoryId, 'all'>;
export type BookingStatus = 'UPCOMING' | 'COMPLETED';
export type PaymentStatus = 'SIMULATED' | 'PAID' | 'FAILED';
export type PaymentResult = 'simulated' | 'failed';
export type TripTab = 'UPCOMING' | 'COMPLETED';

export interface Category {
  id: CategoryId;
  name: string;
  icon: LucideIcon;
}

export interface Destination {
  id: string;
  name: string;
  province: string;
  country: string;
  rating: number;
  reviewsCount: number;
  heroImage: string;
  description: string;
  bestTime: string;
  weather: string;
  highlights: string[];
}

export interface ItineraryItem {
  day: string;
  title: string;
  desc: string;
}

export interface Tour {
  id: string;
  destinationId: string;
  title: string;
  location: string;
  category: TourCategory;
  durationDays: number;
  durationLabel: string;
  departurePoint: string;
  pricePerPerson: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  popularityScore: number;
  isFeatured: boolean;
  isRecommended: boolean;
  badge: string;
  images: string[];
  availableDates: string[];
  description: string;
  itinerary: ItineraryItem[];
  included: string[];
  excluded: string[];
  importantInfo: string[];
}

export interface PopularActivity {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  tourId: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  subtitle: string;
  icon: LucideIcon;
  fee: number;
}

export interface BookingDraft {
  tourId: string | null;
  date: string;
  participants: number;
  includeInsurance: boolean;
  includePickup: boolean;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialNotes: string;
}

export interface Booking {
  id: string;
  tourId: string;
  tourTitle: string;
  tourLocation: string;
  tourImage: string;
  date: string;
  participants: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  totalAmount: number;
  paymentMethod: string;
  status: BookingStatus;
  paymentStatus?: PaymentStatus;
  createdAt: string;
}
