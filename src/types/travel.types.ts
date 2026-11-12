export interface ItineraryItem {
  day: number;
  title: string;
  description: string;
  meals?: string[];
  accommodation?: string;
}

export interface PackageOptionTier {
  id: string;
  name: string;
  description: string;
  priceDelta: number;
}

export interface ReviewItem {
  id: string;
  author: string;
  date: string;
  rating: number;
  comment: string;
}

export interface TravelPackage {
  id: string;
  slug: string;
  name: string;
  description: string;
  destination: string;
  destinationId: string;
  category: string;
  images: string[];
  duration: string;
  durationDays: number;
  price: number;
  discountPrice?: number;
  childPriceMultiplier: number;
  infantPriceMultiplier: number;
  rating: number;
  reviewCount: number;
  highlights: string[];
  packageOptions: PackageOptionTier[];
  departureDates: string[];
  meetingPoint: string;
  departureLocation: string;
  travelSchedule: string;
  accommodationSummary: string;
  transportationSummary: string;
  itinerary: ItineraryItem[];
  inclusions: string[];
  exclusions: string[];
  importantNotes: string[];
  cancellationPolicy: string[];
  reviews: ReviewItem[];
  availability: number;
  minTravelers: number;
  maxTravelers: number;
  featured?: boolean;
  recommended?: boolean;
  specialOffer?: boolean;
}

export interface DestinationInfo {
  id: string;
  name: string;
  country: string;
  region: string;
  category: string;
  tagline: string;
  description: string;
  heroImage: string;
  gallery: string[];
  bestTimeToVisit: string;
  language: string;
  currency: string;
  timezone: string;
  featured?: boolean;
  popularAttractions: {
    name: string;
    description: string;
    category: string;
  }[];
}
