import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Home,
  Compass,
  Heart,
  Briefcase,
  User,
  Bell,
  Search,
  MapPin,
  Calendar,
  Users,
  ChevronLeft,
  ChevronRight,
  Star,
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Info,
  SlidersHorizontal,
  ArrowUpDown,
  Phone,
  Mail,
  MessageCircle,
  Sparkles,
  Plane,
  Hotel,
  Bus,
  Utensils,
  Camera,
  Share2,
  FileText,
  HelpCircle,
  Building2,
  Plus,
  Minus,
  X,
  Loader2,
  Copy,
  Award,
  Headphones,
  Wallet,
  Tag,
  LogOut,
  Settings,
  Check
} from 'lucide-react';

// ============================================================================
// 1. TYPESCRIPT INTERFACES & DATA MODELS
// ============================================================================

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

export interface PaymentChannelOption {
  id: string;
  name: string;
  type: 'gateway_pending' | 'manual_verification' | 'pay_at_office';
  description: string;
  statusLabel: string;
  available: boolean;
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

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
}

type MainTab = 'home' | 'explore' | 'wishlist' | 'bookings' | 'profile';
type StandaloneView =
  | null
  | { type: 'destination'; destinationId: string }
  | { type: 'package'; packageId: string }
  | { type: 'booking'; packageId: string }
  | { type: 'checkout' }
  | { type: 'confirmation'; bookingReference: string }
  | { type: 'bookingDetail'; bookingReference: string }
  | { type: 'infoPage'; page: 'about' | 'contact' | 'help' | 'terms' | 'privacy' };

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

// ============================================================================
// 2. CURATED TRAVEL DATA (ASRIVA TRAVEL & TOURS)
// ============================================================================

const TRAVEL_CATEGORIES = [
  'All',
  'Domestic Tours',
  'International Tours',
  'Adventure',
  'Family Trip',
  'Honeymoon',
  'Private Trip',
  'Group Tour'
];

const PROMO_CODES: Record<string, { label: string; amount: number; minSpend: number }> = {
  ASRIVA250: { label: 'ASRIVA Welcome IDR 250.000 Off', amount: 250000, minSpend: 3000000 },
  BEYOND500: { label: 'Travel Beyond IDR 500.000 Off', amount: 500000, minSpend: 8000000 }
};

const DESTINATIONS_DATA: DestinationInfo[] = [
  {
    id: 'dest-bali',
    name: 'Bali & Nusa Penida',
    country: 'Indonesia',
    region: 'Lesser Sunda Islands',
    category: 'Domestic Tours',
    tagline: 'Island of Gods, Emerald Terraces & Cliffside Lagoons',
    description:
      'Bali blends sacred temple architecture, volcanic highlands, lush Ubud rice terraces, and dramatic limestone cliffs across Nusa Penida. Ideal for serene retreats, cultural immersion, and coastal exploration.',
    heroImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=900&q=80'
    ],
    bestTimeToVisit: 'April – October (Dry Season)',
    language: 'Indonesian, Balinese, English',
    currency: 'IDR (Indonesian Rupiah)',
    timezone: 'WITA (UTC+8)',
    featured: true,
    popularAttractions: [
      {
        name: 'Kelingking Cliff & Diamond Beach',
        description: 'Iconic turquoise bays framed by towering coastal limestone formations on Nusa Penida.',
        category: 'Coastal Nature'
      },
      {
        name: 'Tegalalang & Ubud Highlands',
        description: 'UNESCO-recognized subak irrigation terraces, artisan villages, and jungle wellness retreats.',
        category: 'Culture & Heritage'
      },
      {
        name: 'Uluwatu Sea Temple',
        description: 'Clifftop sanctuary overlooking the Indian Ocean with traditional sunset Kecak performances.',
        category: 'Landmark'
      }
    ]
  },
  {
    id: 'dest-labuan-bajo',
    name: 'Labuan Bajo & Komodo',
    country: 'Indonesia',
    region: 'East Nusa Tenggara',
    category: 'Domestic Tours',
    tagline: 'Sailing Archipelago, Pink Sands & Ancient Dragons',
    description:
      'Gateway to Komodo National Park, Labuan Bajo offers private phinisi liveaboard cruising, panoramic Padar Island treks, vibrant coral reefs, and encounters with the legendary Komodo dragon.',
    heroImage: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80'
    ],
    bestTimeToVisit: 'April – November',
    language: 'Indonesian, Manggarai, English',
    currency: 'IDR (Indonesian Rupiah)',
    timezone: 'WITA (UTC+8)',
    featured: true,
    popularAttractions: [
      {
        name: 'Padar Island Sunrise Ridge',
        description: 'Three crescent bays of white, black, and pink sand viewed from a dramatic volcanic summit.',
        category: 'Adventure Trek'
      },
      {
        name: 'Komodo National Park',
        description: 'Guided ranger wildlife walk in the natural habitat of the world’s largest living lizard.',
        category: 'Wildlife'
      },
      {
        name: 'Manta Point & Taka Makassar',
        description: 'Crystal-clear sandbars and drift snorkeling alongside graceful reef manta rays.',
        category: 'Marine'
      }
    ]
  },
  {
    id: 'dest-kyoto-tokyo',
    name: 'Tokyo & Kyoto',
    country: 'Japan',
    region: 'Kanto & Kansai',
    category: 'International Tours',
    tagline: 'Timeless Zen Sanctuaries & Neon Metropolis',
    description:
      'Experience the seamless contrast between Tokyo’s futuristic districts and Kyoto’s historic wooden machiya streets, bamboo groves, and centuries-old shrines connected by Shinkansen bullet trains.',
    heroImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=900&q=80'
    ],
    bestTimeToVisit: 'March – May & October – November',
    language: 'Japanese, English (Major Hubs)',
    currency: 'JPY (Japanese Yen)',
    timezone: 'JST (UTC+9)',
    featured: true,
    popularAttractions: [
      {
        name: 'Fushimi Inari & Arashiyama',
        description: 'Thousands of vermilion torii gates and serene towering bamboo pathways in historic Kyoto.',
        category: 'Heritage'
      },
      {
        name: 'Mount Fuji & Hakone Valley',
        description: 'Scenic volcanic lake cruises and iconic views of Japan’s highest sacred peak.',
        category: 'Scenic Nature'
      },
      {
        name: 'Asakusa & Shibuya Tokyo',
        description: 'From Edo-period Senso-ji temple lanterns to modern culinary and architectural landmarks.',
        category: 'City Discovery'
      }
    ]
  },
  {
    id: 'dest-swiss',
    name: 'Swiss Alps & Lucerne',
    country: 'Switzerland',
    region: 'Central Europe',
    category: 'International Tours',
    tagline: 'Alpine Glaciers, Panoramic Trains & Lake Villages',
    description:
      'Journey through snow-capped Alpine peaks, emerald glacial lakes, and storybook Swiss villages aboard world-renowned scenic mountain railways.',
    heroImage: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=900&q=80'
    ],
    bestTimeToVisit: 'May – September & December – March',
    language: 'German, French, Italian, English',
    currency: 'CHF (Swiss Franc)',
    timezone: 'CET (UTC+1)',
    featured: false,
    popularAttractions: [
      {
        name: 'Jungfraujoch – Top of Europe',
        description: 'High-altitude cogwheel railway ascent to Europe’s highest railway station and Aletsch Glacier.',
        category: 'Alpine Rail'
      },
      {
        name: 'Lake Lucerne & Mount Pilatus',
        description: 'Steamboat cruise across crystal alpine waters paired with steep cogwheel mountain vistas.',
        category: 'Scenic Lake'
      }
    ]
  },
  {
    id: 'dest-bromo',
    name: 'Bromo & Tumpak Sewu',
    country: 'Indonesia',
    region: 'East Java',
    category: 'Adventure',
    tagline: 'Volcanic Sunrise Caldera & Curtain Waterfalls',
    description:
      'Witness golden sunrise over the smoking Tengger Caldera in 4WD jeeps and descend into the lush amphitheater of Tumpak Sewu Waterfall in East Java.',
    heroImage: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=80'
    ],
    bestTimeToVisit: 'May – October',
    language: 'Indonesian, Javanese, English',
    currency: 'IDR (Indonesian Rupiah)',
    timezone: 'WIB (UTC+7)',
    featured: false,
    popularAttractions: [
      {
        name: 'Penanjakan Sunrise Viewpoint',
        description: 'Panoramic dawn overlook across Mount Bromo, Mount Batok, and Mount Semeru.',
        category: 'Volcano'
      },
      {
        name: 'Tumpak Sewu Waterfall',
        description: 'Multi-tiered curtain waterfall surrounded by tropical canyon walls in Lumajang.',
        category: 'Adventure'
      }
    ]
  }
];

const PACKAGES_DATA: TravelPackage[] = [
  {
    id: 'pkg-bali-ubud-4d3n',
    slug: 'bali-ubud-nusa-penida-escape-4d3n',
    name: 'Bali Ubud & Nusa Penida Signature Escape',
    description:
      'A balanced 4-day curated journey combining Ubud’s emerald jungle villas, sacred water temples, and a private fast-boat expedition across Nusa Penida’s iconic west and east coastal cliffs.',
    destination: 'Bali & Nusa Penida',
    destinationId: 'dest-bali',
    category: 'Honeymoon',
    images: [
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=1000&q=80'
    ],
    duration: '4 Days 3 Nights',
    durationDays: 4,
    price: 5450000,
    discountPrice: 4690000,
    childPriceMultiplier: 0.75,
    infantPriceMultiplier: 0.15,
    rating: 4.9,
    reviewCount: 142,
    highlights: [
      'Private VIP fast-boat crossing and full-day Nusa Penida west cliff tour',
      'Stay in serene Ubud jungle resort & Seminyak coastal boutique hotel',
      'Guided purification visit to Tirta Empul & Tegalalang Rice Terraces',
      'Dedicated private air-conditioned MPV and English/Indonesian driver-guide'
    ],
    packageOptions: [
      {
        id: 'opt-4star',
        name: 'Signature 4-Star Boutique Package',
        description: '4-Star Ubud Resort & Seminyak Hotel (Twin/Double Share)',
        priceDelta: 0
      },
      {
        id: 'opt-5star-villa',
        name: 'Luxury Private Pool Villa Upgrade',
        description: 'Private Pool Villa in Ubud + 5-Star Seminyak Beachfront Suite',
        priceDelta: 2450000
      }
    ],
    departureDates: ['2026-11-20', '2026-11-27', '2026-12-04', '2026-12-18', '2027-01-08'],
    meetingPoint: 'Ngurah Rai International Airport (DPS) Arrival Gate / South Bali Hotel',
    departureLocation: 'Denpasar, Bali',
    travelSchedule: 'Day 1 Arrival before 13:00 WITA • Day 4 Departure after 15:00 WITA',
    accommodationSummary: '2 Nights 4-Star Ubud Jungle Resort + 1 Night Seminyak Boutique Hotel',
    transportationSummary: 'Private Air-Conditioned MPV + Roundtrip VIP Fast Boat Sanur–Nusa Penida',
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Bali & Ubud Cultural Welcome',
        description:
          'Private airport pick-up by ASRIVA tour host. Scenic transfer to Ubud, afternoon visit to Tegalalang Rice Terrace, and welcome Balinese dinner.',
        meals: ['Dinner'],
        accommodation: 'Ubud Boutique Resort (4-Star)'
      },
      {
        day: 2,
        title: 'Tirta Empul Purification & Kintamani Caldera',
        description:
          'Morning visit to Tirta Empul sacred spring temple, coffee plantation tasting, and panoramic Mount Batur caldera lunch.',
        meals: ['Breakfast', 'Lunch'],
        accommodation: 'Ubud Boutique Resort (4-Star)'
      },
      {
        day: 3,
        title: 'Nusa Penida Coastal Expedition',
        description:
          'Morning fast boat from Sanur to Nusa Penida. Explore Kelingking Cliff, Broken Beach, and Angel’s Billabong with private island vehicle and local lunch.',
        meals: ['Breakfast', 'Lunch'],
        accommodation: 'Seminyak Coastal Hotel (4-Star)'
      },
      {
        day: 4,
        title: 'Uluwatu Cliffside & Airport Transfer',
        description:
          'Leisurely breakfast, souvenir stop in Seminyak, scenic Uluwatu coastal stop, and punctual transfer to Ngurah Rai Airport.',
        meals: ['Breakfast']
      }
    ],
    inclusions: [
      '3 nights accommodation (twin/double share) with daily breakfast',
      'Private air-conditioned vehicle & English/Indonesian speaking driver-guide',
      'Roundtrip fast boat tickets Sanur – Nusa Penida – Sanur',
      'All entrance tickets & Nusa Penida island retribution fees',
      'Meals as specified in itinerary (3 Breakfasts, 2 Lunches, 1 Dinner)',
      'Mineral water during tours & travel insurance coverage'
    ],
    exclusions: [
      'Domestic or international flight tickets to/from Bali (DPS)',
      'Personal expenses, laundry, minibar, and optional spa treatments',
      'Tipping for guide and driver (voluntary)'
    ],
    importantNotes: [
      'Nusa Penida terrain involves uneven limestone steps; comfortable footwear is strongly recommended.',
      'Please inform us of dietary allergies at least 48 hours prior to departure.'
    ],
    cancellationPolicy: [
      'Free date modification up to 14 days prior to departure.',
      '50% refund for cancellations made 7–13 days before departure.',
      'Non-refundable within 6 days of departure.'
    ],
    reviews: [
      {
        id: 'r1',
        author: 'Nadia Kartika',
        date: 'Oct 2026',
        rating: 5,
        comment:
          'Effortless itinerary pacing! Our driver was always early and the Nusa Penida boat transfer was super smooth.'
      },
      {
        id: 'r2',
        author: 'Dimas Wijaya',
        date: 'Sep 2026',
        rating: 5,
        comment:
          'Upgraded to the Private Pool Villa option for our anniversary and it was worth every rupiah.'
      }
    ],
    availability: 10,
    minTravelers: 2,
    maxTravelers: 12,
    featured: true,
    recommended: true,
    specialOffer: true
  },
  {
    id: 'pkg-komodo-phinisi-3d2n',
    slug: 'komodo-luxury-phinisi-sailing-3d2n',
    name: 'Komodo & Padar Island Phinisi Liveaboard',
    description:
      'Sail across the turquoise straits of Komodo National Park aboard a handcrafted wooden Phinisi vessel. Trek Padar Island at sunrise, walk alongside Komodo dragons, and snorkel with manta rays.',
    destination: 'Labuan Bajo & Komodo',
    destinationId: 'dest-labuan-bajo',
    category: 'Domestic Tours',
    images: [
      'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80'
    ],
    duration: '3 Days 2 Nights',
    durationDays: 3,
    price: 6200000,
    discountPrice: 5590000,
    childPriceMultiplier: 0.8,
    infantPriceMultiplier: 0.1,
    rating: 4.9,
    reviewCount: 98,
    highlights: [
      '3D2N liveaboard voyage on deluxe air-conditioned wooden Phinisi yacht',
      'Sunrise summit trek at Padar Island overlooking three colored bays',
      'Guided Komodo dragon wildlife walk & Manta Point reef snorkeling',
      'Full-board chef-prepared meals onboard and airport-harbor transfers'
    ],
    packageOptions: [
      {
        id: 'opt-deluxe-cabin',
        name: 'Lower Deck Ensuite Cabin',
        description: 'Air-conditioned private cabin with ensuite bathroom (Twin/Double)',
        priceDelta: 0
      },
      {
        id: 'opt-master-ocean',
        name: 'Upper Deck Ocean-View Master Suite',
        description: 'Panoramic sea-view cabin with private balcony access',
        priceDelta: 1650000
      }
    ],
    departureDates: ['2026-11-21', '2026-11-28', '2026-12-05', '2026-12-19', '2027-01-15'],
    meetingPoint: 'Komodo Airport (LBJ) or Labuan Bajo Harbor Pier',
    departureLocation: 'Labuan Bajo, Flores',
    travelSchedule: 'Day 1 Boarding 10:30 WITA • Day 3 Disembarkation 12:30 WITA',
    accommodationSummary: '2 Nights Ensuite Air-Conditioned Cabin on Deluxe Phinisi Yacht',
    transportationSummary: 'Deluxe Wooden Phinisi Liveaboard + Speedboat Tender + Airport Transfer',
    itinerary: [
      {
        day: 1,
        title: 'Kelor Island, Manjarite & Kalong Sunset',
        description:
          'Airport pick-up and boarding. Hike Kelor Island viewpoint, snorkel coral gardens at Manjarite, and watch thousands of flying foxes at sunset near Kalong Island.',
        meals: ['Lunch', 'Dinner'],
        accommodation: 'Deluxe Phinisi Ensuite Cabin'
      },
      {
        day: 2,
        title: 'Padar Sunrise, Pink Beach, Komodo & Manta Point',
        description:
          'Early sunrise trek at Padar Island, swim at Long Pink Beach, guided ranger trek on Komodo Island, and manta ray snorkeling at Taka Makassar.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Deluxe Phinisi Ensuite Cabin'
      },
      {
        day: 3,
        title: 'Sebayur Reef & Return to Labuan Bajo',
        description:
          'Morning snorkeling at Sebayur Island, leisurely brunch on deck, sail back to Labuan Bajo harbor, and airport transfer.',
        meals: ['Breakfast', 'Lunch']
      }
    ],
    inclusions: [
      '2 nights liveaboard stay in air-conditioned ensuite cabin',
      'Full-board freshly prepared meals onboard (7 meals + afternoon snacks)',
      'Snorkeling gear (mask, snorkel, fins) and life jackets',
      'Harbor transfers in Labuan Bajo & certified tour leader'
    ],
    exclusions: [
      'Komodo National Park entrance & ranger conservation fees (payable on-site)',
      'Flight tickets to/from Komodo Airport (LBJ)',
      'Alcoholic beverages and personal expenses'
    ],
    importantNotes: [
      'Sailing routes may adjust dynamically according to Harbormaster (Syahbandar) sea safety advisories.',
      'Bring reef-safe sunscreen, sunglasses, and personal medication.'
    ],
    cancellationPolicy: [
      'Reschedule allowed up to 14 days before sailing date.',
      'Weather-related port closures qualify for full credit voucher or reschedule.'
    ],
    reviews: [
      {
        id: 'r3',
        author: 'Rendra Pratama',
        date: 'Oct 2026',
        rating: 5,
        comment:
          'The Phinisi crew treated us like family. Fresh seafood dinners under the stars were unforgettable.'
      }
    ],
    availability: 8,
    minTravelers: 1,
    maxTravelers: 10,
    featured: true,
    recommended: true
  },
  {
    id: 'pkg-japan-golden-7d6n',
    slug: 'japan-golden-route-tokyo-fuji-kyoto-7d6n',
    name: 'Japan Golden Route: Tokyo, Mt. Fuji & Kyoto',
    description:
      'Discover Japan’s cultural heartlands and modern icons in 7 thoughtfully paced days. Includes Shinkansen bullet train experience, Mount Fuji panoramic sightseeing, and guided Kyoto temple walks.',
    destination: 'Tokyo & Kyoto',
    destinationId: 'dest-kyoto-tokyo',
    category: 'International Tours',
    images: [
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=1000&q=80'
    ],
    duration: '7 Days 6 Nights',
    durationDays: 7,
    price: 21800000,
    discountPrice: 19950000,
    childPriceMultiplier: 0.85,
    infantPriceMultiplier: 0.2,
    rating: 4.8,
    reviewCount: 76,
    highlights: [
      'Reserved Tokaido Shinkansen bullet train journey from Odawara to Kyoto',
      '1-night authentic Hakone Onsen hot-spring resort with Kaiseki dinner',
      'Guided exploration of Fushimi Inari, Arashiyama Bamboo & Kinkaku-ji',
      'Mount Fuji 5th Station & Lake Kawaguchiko scenic excursion'
    ],
    packageOptions: [
      {
        id: 'opt-standard-japan',
        name: 'Standard 4-Star City Hotels',
        description: 'Centrally located 4-star hotels near transit stations',
        priceDelta: 0
      },
      {
        id: 'opt-premium-japan',
        name: 'Premier Central Deluxe Hotels',
        description: 'Upgraded spacious rooms in Shinjuku & Downtown Kyoto',
        priceDelta: 3800000
      }
    ],
    departureDates: ['2026-12-02', '2026-12-16', '2027-01-20', '2027-03-24'],
    meetingPoint: 'Narita International Airport (NRT) Terminal 1 Arrival Hall',
    departureLocation: 'Tokyo (NRT) / Depart Osaka (KIX)',
    travelSchedule: 'Day 1 Arrival Tokyo • Day 7 Departure Kansai International Airport',
    accommodationSummary: '3 Nights Tokyo City Hotel + 1 Night Hakone Onsen Resort + 2 Nights Kyoto Hotel',
    transportationSummary: 'Private Charter Coach + Tokaido Shinkansen Bullet Train Ticket',
    itinerary: [
      {
        day: 1,
        title: 'Arrive Tokyo & Shinjuku Evening Orientation',
        description: 'Meet ASRIVA tour coordinator at Narita Airport, transfer to central Tokyo hotel, and evening stroll through Shinjuku.',
        meals: ['Dinner'],
        accommodation: 'Shinjuku Granbell or similar (4-Star)'
      },
      {
        day: 2,
        title: 'Asakusa Senso-ji, Meiji Shrine & Shibuya',
        description: 'Full-day Tokyo city tour visiting historic Senso-ji Temple, Nakamise Street, Meiji Jingu forest shrine, and Shibuya Crossing.',
        meals: ['Breakfast', 'Lunch'],
        accommodation: 'Shinjuku Granbell or similar (4-Star)'
      },
      {
        day: 3,
        title: 'Mount Fuji 5th Station & Lake Kawaguchiko',
        description: 'Scenic drive to Mount Fuji 5th Station (weather permitting), Oshino Hakkai springs, and traditional Kaiseki dinner in Hakone.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Hakone Onsen Ryokan Resort'
      },
      {
        day: 4,
        title: 'Shinkansen Bullet Train to Kyoto & Fushimi Inari',
        description: 'Board the high-speed Shinkansen to Kyoto, explore Fushimi Inari Taisha’s vermilion torii gates, and Gion historic district.',
        meals: ['Breakfast', 'Dinner'],
        accommodation: 'Kyoto Urban Boutique Hotel (4-Star)'
      },
      {
        day: 5,
        title: 'Arashiyama Bamboo Grove & Kinkaku-ji Golden Pavilion',
        description: 'Morning walk through Sagano Bamboo Forest, Tenryu-ji garden, and the shimmering Kinkaku-ji Temple.',
        meals: ['Breakfast', 'Lunch'],
        accommodation: 'Kyoto Urban Boutique Hotel (4-Star)'
      },
      {
        day: 6,
        title: 'Nara Deer Park & Osaka Dotonbori Excursion',
        description: 'Day excursion to Todai-ji Temple in Nara followed by vibrant street food exploration in Osaka Dotonbori.',
        meals: ['Breakfast', 'Lunch'],
        accommodation: 'Kyoto Urban Boutique Hotel (4-Star)'
      },
      {
        day: 7,
        title: 'Kansai International Airport Departure',
        description: 'Breakfast at hotel and scheduled transfer to Kansai International Airport (KIX) for return flight.',
        meals: ['Breakfast']
      }
    ],
    inclusions: [
      '6 nights 4-star accommodation including 1 night Hakone Onsen stay',
      'Reserved Shinkansen bullet train ticket (Odawara – Kyoto)',
      'Private tour coach & licensed bilingual tour guide',
      'Daily breakfast + 4 lunches + 3 dinners'
    ],
    exclusions: [
      'International airfare and Japan Visa / Visa Waiver processing fees',
      'Travel insurance (mandatory for international departure)',
      'Personal shopping and optional activities'
    ],
    importantNotes: [
      'Passport must remain valid for at least 6 months from the return date.',
      'Large luggage is transferred separately on Shinkansen day; pack an overnight bag for Day 3.'
    ],
    cancellationPolicy: [
      'Cancellation 21+ days prior: 85% refund less non-refundable rail/ryokan deposits.',
      'Cancellation within 20 days: subject to supplier retention charges.'
    ],
    reviews: [
      {
        id: 'r4',
        author: 'Siti Rahmawati',
        date: 'Sep 2026',
        rating: 5,
        comment:
          'Well-balanced schedule for our family of four. Riding the Shinkansen and staying at Hakone Onsen were highlights.'
      }
    ],
    availability: 14,
    minTravelers: 2,
    maxTravelers: 16,
    featured: true,
    specialOffer: true
  },
  {
    id: 'pkg-bromo-sewu-3d2n',
    slug: 'bromo-sunrise-tumpak-sewu-expedition-3d2n',
    name: 'Bromo Sunrise & Tumpak Sewu Private Expedition',
    description:
      'An exhilarating East Java highland adventure designed for photographers, nature seekers, and active families. Conquer Bromo’s volcanic sea of sand and trek the emerald gorge of Tumpak Sewu.',
    destination: 'Bromo & Tumpak Sewu',
    destinationId: 'dest-bromo',
    category: 'Adventure',
    images: [
      'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80'
    ],
    duration: '3 Days 2 Nights',
    durationDays: 3,
    price: 3350000,
    discountPrice: 2890000,
    childPriceMultiplier: 0.85,
    infantPriceMultiplier: 0.1,
    rating: 4.8,
    reviewCount: 119,
    highlights: [
      'Private 4WD Toyota Land Cruiser sunrise ascent to King Kong Hill',
      'Guided canyon trek to the base of Tumpak Sewu Waterfall & Goa Tetes',
      'Private Innova Reborn overland transport from Surabaya or Malang',
      '2 nights handpicked mountain eco-lodge & Bromo crater-view hotel'
    ],
    packageOptions: [
      {
        id: 'opt-private-standard',
        name: 'Private Expedition (Comfort Lodge)',
        description: 'Private 4WD Jeep + Comfort Highland Accommodation',
        priceDelta: 0
      },
      {
        id: 'opt-private-jiwajawa',
        name: 'Private Expedition (Jiwa Jawa Resort)',
        description: 'Upgraded stay at Jiwa Jawa Bromo Resort + Photographer Guide',
        priceDelta: 1150000
      }
    ],
    departureDates: ['2026-11-20', '2026-11-27', '2026-12-11', '2026-12-25', '2027-01-09'],
    meetingPoint: 'Juanda International Airport (SUB) / Surabaya Gubeng Station',
    departureLocation: 'Surabaya / Malang, East Java',
    travelSchedule: 'Day 1 Pick-up 09:00 WIB • Day 3 Drop-off Surabaya 16:00 WIB',
    accommodationSummary: '1 Night Tumpak Sewu Eco-Lodge + 1 Night Bromo Highland Hotel',
    transportationSummary: 'Private Toyota Innova Reborn + 4WD Toyota Land Cruiser Hardtop',
    itinerary: [
      {
        day: 1,
        title: 'Surabaya Arrival & Transfer to Lumajang Highlands',
        description: 'Pick-up in Surabaya, scenic drive past Malang highlands to Pronojiwo village near Tumpak Sewu.',
        meals: ['Lunch', 'Dinner'],
        accommodation: 'Pronojiwo Highland Lodge'
      },
      {
        day: 2,
        title: 'Tumpak Sewu Waterfall Trek & Transfer to Bromo',
        description: 'Guided descent to the base of Tumpak Sewu waterfall, Goa Tetes canyon, and afternoon transfer to Cemoro Lawang Bromo.',
        meals: ['Breakfast', 'Lunch'],
        accommodation: 'Bromo Lava View / Jiwa Jawa Resort'
      },
      {
        day: 3,
        title: '4WD Bromo Sunrise, Crater Hike & Return',
        description: '03:00 WIB 4WD Jeep ascent to King Kong Hill sunrise, Sea of Sand crossing, Bromo crater rim stairs, breakfast, and return to Surabaya.',
        meals: ['Breakfast']
      }
    ],
    inclusions: [
      'Private vehicle, fuel, tolls, and experienced highland driver',
      'Private 4WD Jeep charter for Bromo sunrise tour',
      '2 nights highland accommodation with breakfast',
      'Local waterfall trekking guide & all national park tickets'
    ],
    exclusions: [
      'Horse rental at Mount Bromo Sea of Sand',
      'Flights or train tickets to/from Surabaya',
      'Personal cold-weather gear and gratuities'
    ],
    importantNotes: [
      'Early morning temperatures at Bromo range between 5°C–10°C; bring a warm windproof jacket.',
      'Tumpak Sewu involves river crossings and bamboo ladders; water-grip footwear is required.'
    ],
    cancellationPolicy: [
      'Free reschedule up to 7 days prior to departure.',
      '50% cancellation fee within 3–6 days of departure.'
    ],
    reviews: [
      {
        id: 'r5',
        author: 'Bagus Setiawan',
        date: 'Oct 2026',
        rating: 5,
        comment:
          'Both Tumpak Sewu and Bromo were clear and breathtaking. Having a private Jeep meant zero waiting.'
      }
    ],
    availability: 6,
    minTravelers: 2,
    maxTravelers: 8,
    recommended: true
  },
  {
    id: 'pkg-swiss-alpine-6d5n',
    slug: 'swiss-alps-scenic-rail-lucerne-jungfrau-6d5n',
    name: 'Swiss Alps Panoramic Rail: Zurich, Lucerne & Jungfrau',
    description:
      'Traverse Switzerland’s iconic lakes and snow-clad peaks with seamless Swiss Travel Pass rail connections, Mount Pilatus Golden Round Trip, and an unforgettable excursion to Jungfraujoch.',
    destination: 'Swiss Alps & Lucerne',
    destinationId: 'dest-swiss',
    category: 'Family Trip',
    images: [
      'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=1000&q=80'
    ],
    duration: '6 Days 5 Nights',
    durationDays: 6,
    price: 34500000,
    childPriceMultiplier: 0.7,
    infantPriceMultiplier: 0.15,
    rating: 5.0,
    reviewCount: 41,
    highlights: [
      '6-day consecutive Swiss Travel Pass for seamless train, boat & bus travel',
      'Jungfraujoch – Top of Europe excursion via Eiger Express gondola',
      'Mount Pilatus Golden Round Trip across Lake Lucerne',
      '2 nights Lucerne lakefront hotel & 3 nights Interlaken alpine hotel'
    ],
    packageOptions: [
      {
        id: 'opt-swiss-2nd',
        name: '2nd Class Swiss Rail + 4-Star Hotels',
        description: 'Consecutive 2nd Class Swiss Travel Pass + 4-Star Accommodation',
        priceDelta: 0
      },
      {
        id: 'opt-swiss-1st',
        name: '1st Class Panoramic Rail Upgrade',
        description: '1st Class Panoramic Coach Seating + Lake-View Rooms',
        priceDelta: 4900000
      }
    ],
    departureDates: ['2026-12-10', '2027-01-14', '2027-02-18', '2027-05-12'],
    meetingPoint: 'Zurich Airport (ZRH) Railway Concourse',
    departureLocation: 'Zurich, Switzerland',
    travelSchedule: 'Day 1 Arrival Zurich • Day 6 Return Train to Zurich Airport',
    accommodationSummary: '2 Nights Lucerne Lakefront Hotel + 3 Nights Interlaken Alpine Hotel',
    transportationSummary: 'Swiss Travel Pass + Eiger Express Gondola & Cogwheel Rail',
    itinerary: [
      {
        day: 1,
        title: 'Zurich Arrival & Scenic Rail to Lucerne',
        description: 'Direct scenic train from Zurich Airport to Lucerne. Walking orientation across Chapel Bridge and Old Town.',
        meals: ['Dinner'],
        accommodation: 'Hotel des Balances or similar (4-Star)'
      },
      {
        day: 2,
        title: 'Mount Pilatus Golden Round Trip',
        description: 'Lake Lucerne steamer cruise, world’s steepest cogwheel railway ascent to Pilatus Kulm, and aerial cableway descent.',
        meals: ['Breakfast'],
        accommodation: 'Hotel des Balances or similar (4-Star)'
      },
      {
        day: 3,
        title: 'Lucerne–Interlaken Express Panoramic Train',
        description: 'Board the panoramic train over Brünig Pass past five crystal alpine lakes to Interlaken.',
        meals: ['Breakfast'],
        accommodation: 'Interlaken Boutique Alpine Hotel (4-Star)'
      },
      {
        day: 4,
        title: 'Jungfraujoch – Top of Europe Excursion',
        description: 'Ascend via Grindelwald Terminal Eiger Express and Jungfrau Railway to 3,454m Ice Palace and Sphinx Observatory.',
        meals: ['Breakfast', 'Lunch'],
        accommodation: 'Interlaken Boutique Alpine Hotel (4-Star)'
      },
      {
        day: 5,
        title: 'Lauterbrunnen Valley & Lake Brienz Cruise',
        description: 'Explore the 72-waterfall valley of Lauterbrunnen and enjoy an afternoon boat cruise on turquoise Lake Brienz.',
        meals: ['Breakfast'],
        accommodation: 'Interlaken Boutique Alpine Hotel (4-Star)'
      },
      {
        day: 6,
        title: 'Departure to Zurich Airport',
        description: 'Breakfast at hotel and direct rail connection to Zurich Airport for onward international flight.',
        meals: ['Breakfast']
      }
    ],
    inclusions: [
      '5 nights 4-star Swiss hotel accommodation with daily buffet breakfast',
      '6-day consecutive Swiss Travel Pass (unlimited train, bus & boat network)',
      'Reserved roundtrip mountain excursion tickets to Jungfraujoch & Mount Pilatus',
      'Welcome dinner in Lucerne and alpine lunch at Jungfraujoch'
    ],
    exclusions: [
      'International flights to/from Zurich (ZRH)',
      'Schengen Visa application fees & mandatory travel insurance',
      'City tourist tax (approx. CHF 3.50–4.50 per person/night payable at hotel)'
    ],
    importantNotes: [
      'Valid Schengen visa is required for Indonesian passport holders.',
      'Sunglasses and layered thermal clothing are essential even during spring/summer at Jungfraujoch.'
    ],
    cancellationPolicy: [
      'Mountain railway passes are non-refundable once ticketed.',
      'Hotel components follow 21-day prior notice terms.'
    ],
    reviews: [
      {
        id: 'r6',
        author: 'Hendro & Family',
        date: 'Aug 2026',
        rating: 5,
        comment:
          'Swiss train punctuality combined with ASRIVA’s clear digital vouchers made traveling with kids effortless.'
      }
    ],
    availability: 8,
    minTravelers: 2,
    maxTravelers: 10,
    featured: true
  },
  {
    id: 'pkg-bali-group-corporate-3d2n',
    slug: 'bali-south-coast-cultural-group-tour-3d2n',
    name: 'Bali Coastal & Cultural Discovery Group Tour',
    description:
      'A value-packed 3-day group itinerary covering Tanjung Benoa marine sports, Garuda Wisnu Kencana Cultural Park, Jimbaran sunset seafood dining, and Tanah Lot sea temple.',
    destination: 'Bali & Nusa Penida',
    destinationId: 'dest-bali',
    category: 'Group Tour',
    images: [
      'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=80'
    ],
    duration: '3 Days 2 Nights',
    durationDays: 3,
    price: 2950000,
    discountPrice: 2490000,
    childPriceMultiplier: 0.75,
    infantPriceMultiplier: 0.1,
    rating: 4.7,
    reviewCount: 205,
    highlights: [
      'Complimentary Banana Boat water sport session at Tanjung Benoa',
      'Sunset beachfront grilled seafood dinner at Jimbaran Bay',
      'Guided visits to GWK Cultural Park, Bedugul Ulun Danu & Tanah Lot',
      'Comfortable air-conditioned tourist coach with licensed HPI guide'
    ],
    packageOptions: [
      {
        id: 'opt-group-twin',
        name: 'Twin / Triple Sharing Room',
        description: '4-Star Kuta/Nusa Dua Hotel (2–3 guests per room)',
        priceDelta: 0
      },
      {
        id: 'opt-group-single',
        name: 'Single Room Occupancy',
        description: 'Private single room throughout the 3D2N tour',
        priceDelta: 850000
      }
    ],
    departureDates: ['2026-11-22', '2026-11-29', '2026-12-06', '2026-12-20'],
    meetingPoint: 'Ngurah Rai International Airport (DPS)',
    departureLocation: 'Kuta / Nusa Dua, Bali',
    travelSchedule: 'Day 1 Arrival before 12:00 WITA • Day 3 Departure after 14:00 WITA',
    accommodationSummary: '2 Nights 4-Star Kuta / Nusa Dua Resort',
    transportationSummary: 'Executive Tourist Bus / Hiace Commuter + Licensed Tour Guide',
    itinerary: [
      {
        day: 1,
        title: 'Arrival, GWK Cultural Park & Jimbaran Sunset Dinner',
        description: 'Airport welcome, visit Garuda Wisnu Kencana statue monument, Pandawa Beach, and beachfront grilled seafood dinner at Jimbaran Bay.',
        meals: ['Dinner'],
        accommodation: 'Kuta / Nusa Dua 4-Star Hotel'
      },
      {
        day: 2,
        title: 'Tanjung Benoa, Bedugul Ulun Danu & Tanah Lot',
        description: 'Morning banana boat ride at Tanjung Benoa, scenic drive to Ulun Danu Beratan lake temple, and sunset at Tanah Lot.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Kuta / Nusa Dua 4-Star Hotel'
      },
      {
        day: 3,
        title: 'Krisna Souvenir Center & Airport Transfer',
        description: 'Hotel check-out, local Balinese crafts shopping, and transfer to airport.',
        meals: ['Breakfast']
      }
    ],
    inclusions: [
      '2 nights hotel stay with daily breakfast',
      'Air-conditioned group coach & HPI-licensed tour guide',
      'Complimentary 1x Banana Boat activity at Tanjung Benoa',
      'All entrance fees and meals per itinerary'
    ],
    exclusions: [
      'Flight tickets & personal optional water sports',
      'Guide & driver standard tipping'
    ],
    importantNotes: [
      'Group departures operate on scheduled dates with fellow ASRIVA travelers.'
    ],
    cancellationPolicy: [
      'Reschedule permitted up to 10 days before departure.'
    ],
    reviews: [
      {
        id: 'r7',
        author: 'Ayu Lestari',
        date: 'Oct 2026',
        rating: 5,
        comment: 'Super affordable and well-organized! Great for first-time visitors to Bali.'
      }
    ],
    availability: 18,
    minTravelers: 1,
    maxTravelers: 25,
    recommended: true,
    specialOffer: true
  }
];

const PAYMENT_CHANNELS: PaymentChannelOption[] = [
  {
    id: 'bank_transfer_verified',
    name: 'Bank Transfer (Manual Verification)',
    type: 'manual_verification',
    description:
      'Submit your booking reservation now and complete transfer using your Booking Reference. Payment status remains Unpaid until verified by ASRIVA Finance.',
    statusLabel: 'Available — Manual Verification',
    available: true
  },
  {
    id: 'office_settlement',
    name: 'Pay at ASRIVA Tour Desk / Counter',
    type: 'pay_at_office',
    description:
      'Hold your reservation slot and settle payment directly at our official tour counter with your Booking Reference.',
    statusLabel: 'Available — Reservation Hold',
    available: true
  },
  {
    id: 'online_gateway',
    name: 'Instant Payment Gateway (VA / QRIS / Card)',
    type: 'gateway_pending',
    description:
      'Direct automated payment gateway integration is currently not connected in this storefront environment.',
    statusLabel: 'Integration Not Available',
    available: false
  }
];

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    title: 'Seasonal Promo Code Available',
    message: 'Apply code ASRIVA250 at booking for IDR 250.000 off orders above IDR 3.000.000.',
    time: 'Today',
    unread: true
  },
  {
    id: 'n2',
    title: 'Guest Checkout Enabled',
    message: 'Book any domestic or international package without creating an account.',
    time: '2 days ago',
    unread: false
  }
];

// ============================================================================
// 3. UTILITY FUNCTIONS
// ============================================================================

function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

function formatDateReadable(isoDate: string): string {
  if (!isoDate) return '-';
  const parts = isoDate.split('-');
  if (parts.length !== 3) return isoDate;
  const dateObj = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  if (isNaN(dateObj.getTime())) return isoDate;
  return dateObj.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

function calculateReturnDate(departureIso: string, durationDays: number): string {
  if (!departureIso) return '-';
  const parts = departureIso.split('-');
  if (parts.length !== 3) return '-';
  const dateObj = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  if (isNaN(dateObj.getTime())) return '-';
  dateObj.setDate(dateObj.getDate() + Math.max(0, durationDays - 1));
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return formatDateReadable(`${y}-${m}-${d}`);
}

function generateBookingReference(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let suffix = '';
  for (let i = 0; i < 6; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const now = new Date();
  const ym = `${String(now.getFullYear()).slice(-2)}${String(now.getMonth() + 1).padStart(2, '0')}`;
  return `ASR-${ym}-${suffix}`;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/[\s\-()+]/g, '');
  return /^\d{8,15}$/.test(digits);
}

interface PricingBreakdown {
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

function calculateBookingPricing(
  pkg: TravelPackage,
  optionId: string,
  adults: number,
  children: number,
  infants: number,
  promoCodeInput: string
): PricingBreakdown {
  const selectedOption = pkg.packageOptions.find((o) => o.id === optionId) || pkg.packageOptions[0];
  const optionDelta = selectedOption ? selectedOption.priceDelta : 0;

  const unitBasePrice = pkg.price + optionDelta;
  const unitEffectivePrice = (pkg.discountPrice ?? pkg.price) + optionDelta;

  const adultBase = unitBasePrice;
  const childBase = Math.round(unitBasePrice * pkg.childPriceMultiplier);
  const infantBase = Math.round(unitBasePrice * pkg.infantPriceMultiplier);

  const adultUnitPrice = unitEffectivePrice;
  const childUnitPrice = Math.round(unitEffectivePrice * pkg.childPriceMultiplier);
  const infantUnitPrice = Math.round(unitEffectivePrice * pkg.infantPriceMultiplier);

  const baseSubtotal = adults * adultBase + children * childBase + infants * infantBase;
  const adultsTotal = adults * adultUnitPrice;
  const childrenTotal = children * childUnitPrice;
  const infantsTotal = infants * infantUnitPrice;

  const subtotalAfterPackageDiscount = adultsTotal + childrenTotal + infantsTotal;
  const packageDiscountTotal = Math.max(0, baseSubtotal - subtotalAfterPackageDiscount);

  const normalizedPromo = promoCodeInput.trim().toUpperCase();
  const promoRule = PROMO_CODES[normalizedPromo];
  const promoCodeValid = Boolean(promoRule && subtotalAfterPackageDiscount >= promoRule.minSpend);
  const promoDiscount = promoCodeValid ? promoRule.amount : 0;

  const serviceFee = subtotalAfterPackageDiscount > 0 ? 50000 : 0;
  const totalAmount = Math.max(0, subtotalAfterPackageDiscount - promoDiscount + serviceFee);
  const totalTravelers = adults + children + infants;

  return {
    optionDelta,
    adultUnitPrice,
    childUnitPrice,
    infantUnitPrice,
    adultsTotal,
    childrenTotal,
    infantsTotal,
    baseSubtotal,
    packageDiscountTotal,
    subtotalAfterPackageDiscount,
    promoDiscount,
    promoCodeValid,
    promoLabel: promoCodeValid ? promoRule.label : undefined,
    serviceFee,
    totalAmount,
    totalTravelers
  };
}

function reconcileTravelers(
  existing: Traveler[],
  adults: number,
  children: number,
  infants: number
): Traveler[] {
  const desiredTypes: ('Adult' | 'Child' | 'Infant')[] = [
    ...Array(adults).fill('Adult'),
    ...Array(children).fill('Child'),
    ...Array(infants).fill('Infant')
  ];

  return desiredTypes.map((type, index) => {
    const prev = existing[index];
    if (prev) {
      return {
        ...prev,
        type
      };
    }
    return {
      id: `trav-${index + 1}-${Math.random().toString(36).slice(2, 7)}`,
      type,
      fullName: '',
      dateOfBirth: '',
      gender: '',
      identityNumber: '',
      specialRequirements: ''
    };
  });
}

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
  flex-shrink: 0;
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  padding-top: env(safe-area-inset-top, 0px);
  z-index: 20;
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
// 5. REUSABLE UI COMPONENTS
// ============================================================================

const Badge: React.FC<{
  children: React.ReactNode;
  variant?: 'navy' | 'ocean' | 'accent' | 'success' | 'warning' | 'error' | 'neutral';
  className?: string;
}> = ({ children, variant = 'ocean', className = '' }) => {
  const styles: Record<string, string> = {
    navy: 'bg-[#0B2545] text-white',
    ocean: 'bg-[#E7F3F8] text-[#136F99]',
    accent: 'bg-[#FEF3C7] text-[#B45309]',
    success: 'bg-[#ECFDF5] text-[#047857]',
    warning: 'bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]',
    error: 'bg-[#FEF2F2] text-[#B91C1C]',
    neutral: 'bg-slate-100 text-slate-700'
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-tight ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

const AlertBanner: React.FC<{
  type?: 'info' | 'warning' | 'error' | 'success';
  title?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ type = 'info', title, children, className = '' }) => {
  const config = {
    info: {
      bg: 'bg-[#E7F3F8] border-[#BAE6FD] text-[#0B2545]',
      icon: <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#136F99]" />
    },
    warning: {
      bg: 'bg-[#FFFBEB] border-[#FDE68A] text-[#92400E]',
      icon: <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#D97706]" />
    },
    error: {
      bg: 'bg-[#FEF2F2] border-[#FECACA] text-[#991B1B]',
      icon: <XCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#DC2626]" />
    },
    success: {
      bg: 'bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]',
      icon: <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#059669]" />
    }
  }[type];

  return (
    <div className={`rounded-xl border p-3 text-xs leading-relaxed flex gap-2.5 ${config.bg} ${className}`}>
      {config.icon}
      <div className="flex-1 min-w-0">
        {title && <div className="font-bold mb-0.5">{title}</div>}
        <div>{children}</div>
      </div>
    </div>
  );
};

const EmptyState: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}> = ({ icon, title, description, actionLabel, onAction }) => (
  <div className="flex flex-col items-center justify-center text-center py-10 px-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
    <div className="w-12 h-12 rounded-2xl bg-[#E7F3F8] text-[#136F99] flex items-center justify-center mb-3">
      {icon}
    </div>
    <h3 className="text-sm font-bold text-slate-900 mb-1">{title}</h3>
    <p className="text-xs text-slate-500 leading-relaxed max-w-[260px] mb-4">{description}</p>
    {actionLabel && onAction && (
      <button
        type="button"
        onClick={onAction}
        className="px-4 py-2.5 rounded-xl bg-[#0B2545] text-white text-xs font-semibold active:scale-[0.98] transition"
      >
        {actionLabel}
      </button>
    )}
  </div>
);

const ModalDialog: React.FC<{
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}> = ({ open, title, onClose, children, footer }) => {
  if (!open) return null;
  return (
    <div
      className="absolute inset-0 z-50 bg-slate-900/50 backdrop-blur-[1px] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white w-full max-w-[440px] max-h-[82%] rounded-2xl shadow-xl flex flex-col overflow-hidden animate-fade-in">
        <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between shrink-0">
          <h3 className="text-sm font-bold text-slate-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto flex-1 text-xs text-slate-600 leading-relaxed">{children}</div>
        {footer && <div className="px-4 py-3 border-t border-slate-100 bg-slate-50 shrink-0">{footer}</div>}
      </div>
    </div>
  );
};

const BottomSheet: React.FC<{
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ open, title, onClose, children }) => {
  if (!open) return null;
  return (
    <div
      className="absolute inset-0 z-50 bg-slate-900/50 flex flex-col justify-end"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-h-[85%] rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pt-2.5 pb-1 flex justify-center shrink-0">
          <div className="w-10 h-1 rounded-full bg-slate-300" />
        </div>
        <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between shrink-0">
          <h3 className="text-sm font-bold text-slate-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sheet"
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};

const PackageCard: React.FC<{
  pkg: TravelPackage;
  onSelect: (pkgId: string) => void;
  isWishlisted: boolean;
  onToggleWishlist: (pkgId: string) => void;
  compact?: boolean;
}> = ({ pkg, onSelect, isWishlisted, onToggleWishlist, compact = false }) => {
  const effectivePrice = pkg.discountPrice ?? pkg.price;
  const hasDiscount = typeof pkg.discountPrice === 'number' && pkg.discountPrice < pkg.price;
  const discountPercent = hasDiscount
    ? Math.round(((pkg.price - pkg.discountPrice!) / pkg.price) * 100)
    : 0;

  if (compact) {
    return (
      <div
        onClick={() => onSelect(pkg.id)}
        className="w-[248px] shrink-0 bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs active:scale-[0.99] transition cursor-pointer flex flex-col"
      >
        <div className="relative h-32 w-full bg-slate-200">
          <img src={pkg.images[0]} alt={pkg.name} className="w-full h-full object-cover" loading="lazy" />
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0B2545]/85 text-white backdrop-blur-xs">
            {pkg.category}
          </span>
          <button
            type="button"
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(pkg.id);
            }}
            className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 text-slate-700 flex items-center justify-center shadow-xs active:scale-90 transition"
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-slate-600'}`} />
          </button>
          {hasDiscount && (
            <span className="absolute bottom-2 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#D97706] text-white">
              -{discountPercent}%
            </span>
          )}
        </div>
        <div className="p-3 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-1 text-[11px] text-slate-500 mb-1">
              <span className="inline-flex items-center gap-1 truncate">
                <MapPin className="w-3 h-3 text-[#136F99] shrink-0" />
                <span className="truncate">{pkg.destination}</span>
              </span>
              <span className="inline-flex items-center gap-0.5 font-semibold text-slate-700 shrink-0">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                {pkg.rating.toFixed(1)}
              </span>
            </div>
            <h4 className="text-[13px] font-bold text-slate-900 line-clamp-2 leading-snug mb-1.5">{pkg.name}</h4>
            <div className="text-[11px] text-slate-500 flex items-center justify-between mb-2.5">
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                {pkg.duration}
              </span>
              <span className="text-[10px] font-semibold text-emerald-700">{pkg.availability} spots left</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-end justify-between">
            <div>
              {hasDiscount && (
                <div className="text-[10px] text-slate-400 line-through">{formatIDR(pkg.price)}</div>
              )}
              <div className="text-sm font-extrabold text-[#0B2545]">{formatIDR(effectivePrice)}</div>
              <div className="text-[10px] text-slate-400">per adult</div>
            </div>
            <span className="px-2.5 py-1.5 rounded-lg bg-[#E7F3F8] text-[#136F99] text-[11px] font-bold">
              Details
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => onSelect(pkg.id)}
      className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs active:scale-[0.99] transition cursor-pointer"
    >
      <div className="relative h-44 w-full bg-slate-200">
        <img src={pkg.images[0]} alt={pkg.name} className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/95 text-[#0B2545] shadow-xs">
            {pkg.category}
          </span>
          {hasDiscount && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#D97706] text-white shadow-xs">
              Save {discountPercent}%
            </span>
          )}
        </div>
        <button
          type="button"
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(pkg.id);
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 text-slate-700 flex items-center justify-center shadow-xs active:scale-90 transition"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-slate-600'}`} />
        </button>

        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-[11px]">
          <span className="inline-flex items-center gap-1 font-medium">
            <MapPin className="w-3.5 h-3.5 text-amber-300" />
            {pkg.destination}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 bg-black/45 px-2 py-0.5 rounded-md">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              {pkg.rating.toFixed(1)} ({pkg.reviewCount})
            </span>
            <span className="inline-flex items-center gap-1 bg-black/45 px-2 py-0.5 rounded-md">
              <Clock className="w-3 h-3" />
              {pkg.duration}
            </span>
          </div>
        </div>
      </div>

      <div className="p-3.5">
        <h3 className="text-[15px] font-bold text-slate-900 leading-snug mb-1.5">{pkg.name}</h3>
        <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-3">
          <span className="inline-flex items-center gap-1.5 truncate">
            <Calendar className="w-3.5 h-3.5 text-[#136F99] shrink-0" />
            <span className="truncate">
              Next: <strong className="text-slate-700">{formatDateReadable(pkg.departureDates[0])}</strong>
            </span>
          </span>
          <Badge variant="success" className="shrink-0">
            {pkg.availability} seats available
          </Badge>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Starting from</div>
            {hasDiscount && (
              <div className="text-xs text-slate-400 line-through leading-tight">{formatIDR(pkg.price)}</div>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-base font-extrabold text-[#0B2545]">{formatIDR(effectivePrice)}</span>
              <span className="text-[11px] text-slate-500">/ pax</span>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(pkg.id);
            }}
            className="px-4 py-2.5 rounded-xl bg-[#0B2545] text-white text-xs font-bold shadow-xs hover:bg-[#06172D] active:scale-[0.98] transition inline-flex items-center gap-1"
          >
            <span>View Details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

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
  const [priceFilter, setPriceFilter] = useState<'all' | 'under5m' | '5mto15m' | 'above15m'>('all');
  const [durationFilter, setDurationFilter] = useState<'all' | '1to3' | '4to5' | '6plus'>('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'price_asc' | 'price_desc' | 'rating_desc'>('recommended');
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

  const activeBookingPackage = useMemo(() => {
    return PACKAGES_DATA.find((p) => p.id === bookingDraft.packageId) || PACKAGES_DATA[0];
  }, [bookingDraft.packageId]);

  const activePricing = useMemo(() => {
    return calculateBookingPricing(
      activeBookingPackage,
      bookingDraft.optionId,
      bookingDraft.adults,
      bookingDraft.children,
      bookingDraft.infants,
      bookingDraft.promoCode
    );
  }, [
    activeBookingPackage,
    bookingDraft.optionId,
    bookingDraft.adults,
    bookingDraft.children,
    bookingDraft.infants,
    bookingDraft.promoCode
  ]);

  const filteredPackages = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = PACKAGES_DATA.filter((pkg) => {
      if (q) {
        const matchName = pkg.name.toLowerCase().includes(q);
        const matchDest = pkg.destination.toLowerCase().includes(q);
        const matchCat = pkg.category.toLowerCase().includes(q);
        const matchDesc = pkg.description.toLowerCase().includes(q);
        if (!matchName && !matchDest && !matchCat && !matchDesc) return false;
      }
      if (selectedCategory !== 'All' && pkg.category !== selectedCategory) return false;
      if (selectedDestinationFilter !== 'All' && pkg.destinationId !== selectedDestinationFilter) return false;

      const effPrice = pkg.discountPrice ?? pkg.price;
      if (priceFilter === 'under5m' && effPrice >= 5000000) return false;
      if (priceFilter === '5mto15m' && (effPrice < 5000000 || effPrice > 15000000)) return false;
      if (priceFilter === 'above15m' && effPrice <= 15000000) return false;

      if (durationFilter === '1to3' && pkg.durationDays > 3) return false;
      if (durationFilter === '4to5' && (pkg.durationDays < 4 || pkg.durationDays > 5)) return false;
      if (durationFilter === '6plus' && pkg.durationDays < 6) return false;

      return true;
    });

    return [...list].sort((a, b) => {
      const priceA = a.discountPrice ?? a.price;
      const priceB = b.discountPrice ?? b.price;
      if (sortBy === 'price_asc') return priceA - priceB;
      if (sortBy === 'price_desc') return priceB - priceA;
      if (sortBy === 'rating_desc') return b.rating - a.rating;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [searchQuery, selectedCategory, selectedDestinationFilter, priceFilter, durationFilter, sortBy]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'All') count++;
    if (selectedDestinationFilter !== 'All') count++;
    if (priceFilter !== 'all') count++;
    if (durationFilter !== 'all') count++;
    return count;
  }, [selectedCategory, selectedDestinationFilter, priceFilter, durationFilter]);

  // Navigation Helpers
  const openPackageDetail = (packageId: string) => {
    setGalleryIndex(0);
    setStandalone({ type: 'package', packageId });
  };

  const openDestinationDetail = (destinationId: string) => {
    setStandalone({ type: 'destination', destinationId });
  };

  const startBookingForPackage = (packageId: string) => {
    const pkg = PACKAGES_DATA.find((p) => p.id === packageId);
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
  );

  // DESTINATION DETAIL PAGE
  const renderDestinationPage = (destinationId: string) => {
    const dest = DESTINATIONS_DATA.find((d) => d.id === destinationId);
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

    const relatedPackages = PACKAGES_DATA.filter((p) => p.destinationId === dest.id);
    const otherDestinations = DESTINATIONS_DATA.filter((d) => d.id !== dest.id);

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
    const pkg = PACKAGES_DATA.find((p) => p.id === packageId);
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
    const pkg = PACKAGES_DATA.find((p) => p.id === packageId) || activeBookingPackage;
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
  const renderHomePage = () => {
    const featuredPackages = PACKAGES_DATA.filter((p) => p.featured);
    const recommendedPackages = PACKAGES_DATA.filter((p) => p.recommended);
    const specialOffers = PACKAGES_DATA.filter((p) => p.specialOffer);

    return (
      <div className="p-4 space-y-6 pb-8">
        {/* Tagline & Search Destination */}
        <div className="space-y-3">
          <div>
            <p className="text-xs font-semibold text-[#136F99]">Discover More. Travel Beyond.</p>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Where would you like to go next?
            </h2>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setActiveTab('explore');
            }}
            className="flex items-center gap-2 bg-white rounded-2xl border border-slate-200 px-3.5 py-2.5 shadow-2xs"
          >
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search destinations, Bali, Komodo, Japan..."
              className="flex-1 text-xs text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl bg-[#0B2545] text-white text-[11px] font-bold shrink-0"
            >
              Search
            </button>
          </form>
        </div>

        {/* Hero Promotional Banner */}
        <div className="relative rounded-2xl overflow-hidden bg-[#0B2545] text-white p-4 shadow-md">
          <img
            src="https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=900&q=70"
            alt="Featured journey"
            className="absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none"
          />
          <div className="relative z-10 max-w-[82%]">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3 h-3" />
              ASRIVA Signature Collection
            </span>
            <h3 className="text-base font-extrabold leading-snug mb-1">
              Curated Journeys Across Indonesia & Beyond
            </h3>
            <p className="text-[11px] text-slate-200 leading-relaxed mb-3">
              Reserve instantly as a guest with transparent IDR pricing, verified guides, and zero login hassle.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All');
                setActiveTab('explore');
              }}
              className="px-4 py-2 rounded-xl bg-[#D97706] text-white text-xs font-extrabold shadow-xs active:scale-95 transition"
            >
              Explore Packages
            </button>
          </div>
        </div>

        {/* Travel Categories */}
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 mb-2.5">Travel Categories</h3>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {TRAVEL_CATEGORIES.filter((c) => c !== 'All').map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  setActiveTab('explore');
                }}
                className="px-3.5 py-2 rounded-xl bg-white border border-slate-200/90 text-xs font-semibold text-slate-700 whitespace-nowrap shadow-2xs hover:border-[#136F99] hover:text-[#136F99] active:scale-95 transition"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Popular Destinations */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-sm font-extrabold text-slate-900">Popular Destinations</h3>
            <button
              type="button"
              onClick={() => setActiveTab('explore')}
              className="text-xs font-bold text-[#136F99]"
            >
              See all
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {DESTINATIONS_DATA.map((dest) => (
              <div
                key={dest.id}
                onClick={() => openDestinationDetail(dest.id)}
                className="relative w-36 h-44 rounded-2xl overflow-hidden shrink-0 bg-slate-800 shadow-xs cursor-pointer active:scale-[0.98] transition"
              >
                <img src={dest.heroImage} alt={dest.name} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/20 to-transparent" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                  <div className="text-[10px] text-amber-300 font-semibold">{dest.country}</div>
                  <div className="text-xs font-bold leading-tight">{dest.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Tour Packages */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Featured Tour Packages</h3>
              <p className="text-[11px] text-slate-500">Handpicked signature itineraries</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('explore')}
              className="text-xs font-bold text-[#136F99]"
            >
              View all
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {featuredPackages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                onSelect={openPackageDetail}
                isWishlisted={wishlistIds.includes(pkg.id)}
                onToggleWishlist={toggleWishlist}
                compact
              />
            ))}
          </div>
        </div>

        {/* Special Offers */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Special Offers</h3>
              <p className="text-[11px] text-slate-500">Promotional fares & seasonal savings</p>
            </div>
          </div>
          <div className="space-y-3">
            {specialOffers.slice(0, 2).map((pkg) => (
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

        {/* Recommended Experiences */}
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 mb-2.5">Recommended Experiences</h3>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {recommendedPackages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                onSelect={openPackageDetail}
                isWishlisted={wishlistIds.includes(pkg.id)}
                onToggleWishlist={toggleWishlist}
                compact
              />
            ))}
          </div>
        </div>

        {/* Customer Testimonials */}
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 mb-2.5">Customer Testimonials</h3>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {[
              {
                name: 'Nadia Kartika',
                trip: 'Bali Ubud & Nusa Penida Escape',
                quote:
                  'Seamless guest booking without needing an account. Our driver in Ubud and fast boat transfers were spotless.'
              },
              {
                name: 'Rendra Pratama',
                trip: 'Komodo Phinisi Liveaboard',
                quote:
                  'Clear pricing breakdown from start to finish. Padar Island at sunrise exceeded every expectation.'
              },
              {
                name: 'Siti Rahmawati',
                trip: 'Japan Golden Route 7D6N',
                quote:
                  'Booked for four family members easily. Looking up our booking reference in My Trips was effortless.'
              }
            ].map((item, i) => (
              <div
                key={i}
                className="w-64 shrink-0 bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-0.5 text-amber-400 mb-2">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star key={idx} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">"{item.quote}"</p>
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <div className="text-xs font-bold text-slate-900">{item.name}</div>
                  <div className="text-[10px] text-slate-400">{item.trip}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Navigation Card */}
        <footer className="bg-[#0B2545] text-white rounded-2xl p-4 space-y-3 text-xs">
          <div>
            <div className="font-extrabold text-sm tracking-tight">ASRIVA TRAVEL & TOURS</div>
            <div className="text-[11px] text-sky-200 mt-0.5">Discover More. Travel Beyond.</div>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-slate-200">
            <button
              type="button"
              onClick={() => setStandalone({ type: 'infoPage', page: 'about' })}
              className="text-left hover:text-white"
            >
              About ASRIVA
            </button>
            <button
              type="button"
              onClick={() => setStandalone({ type: 'infoPage', page: 'contact' })}
              className="text-left hover:text-white"
            >
              Contact Concierge
            </button>
            <button
              type="button"
              onClick={() => setStandalone({ type: 'infoPage', page: 'help' })}
              className="text-left hover:text-white"
            >
              Help Center & FAQ
            </button>
            <button
              type="button"
              onClick={() => setStandalone({ type: 'infoPage', page: 'terms' })}
              className="text-left hover:text-white"
            >
              Terms & Privacy
            </button>
          </div>
        </footer>
      </div>
    );
  };

  // EXPLORE DESTINATIONS & TOUR PACKAGES PAGE
  const renderExplorePage = () => {
    const featuredDestinations = DESTINATIONS_DATA.filter((d) => d.featured);

    return (
      <div className="p-4 space-y-4 pb-8">
        {/* Search & Filter Controls */}
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 bg-white rounded-xl border border-slate-200 px-3 py-2.5 shadow-2xs">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search destinations or tour packages..."
              className="flex-1 text-xs text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery('')} className="text-slate-400">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setFilterSheetOpen(true)}
            className="relative px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 shadow-2xs shrink-0"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#136F99]" />
            <span>Filter</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#0B2545] text-white text-[10px] flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
          {TRAVEL_CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                  active
                    ? 'bg-[#0B2545] text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Featured Destinations Strip */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Featured Destinations
            </h3>
            {selectedDestinationFilter !== 'All' && (
              <button
                type="button"
                onClick={() => setSelectedDestinationFilter('All')}
                className="text-[11px] font-bold text-[#136F99]"
              >
                Show All
              </button>
            )}
          </div>
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
            {featuredDestinations.map((dest) => {
              const isFiltered = selectedDestinationFilter === dest.id;
              return (
                <div
                  key={dest.id}
                  onClick={() => openDestinationDetail(dest.id)}
                  className={`w-44 shrink-0 rounded-2xl overflow-hidden bg-white border transition cursor-pointer ${
                    isFiltered ? 'border-[#136F99] ring-2 ring-[#136F99]/20' : 'border-slate-200/80'
                  }`}
                >
                  <div className="relative h-24">
                    <img src={dest.heroImage} alt={dest.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />
                    <div className="absolute bottom-2 left-2.5 right-2.5 text-white">
                      <div className="text-xs font-bold leading-tight truncate">{dest.name}</div>
                      <div className="text-[10px] text-slate-200">{dest.country}</div>
                    </div>
                  </div>
                  <div className="px-2.5 py-2 flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-[#136F99]">Destination Guide</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#136F99]" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Destination Filter Pills */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedDestinationFilter('All')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap ${
              selectedDestinationFilter === 'All'
                ? 'bg-[#E7F3F8] text-[#136F99] border border-[#136F99]/30'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            All Destinations
          </button>
          {DESTINATIONS_DATA.map((dest) => {
            const active = selectedDestinationFilter === dest.id;
            return (
              <button
                key={dest.id}
                type="button"
                onClick={() => setSelectedDestinationFilter(dest.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap ${
                  active
                    ? 'bg-[#E7F3F8] text-[#136F99] border border-[#136F99]/30'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {dest.name}
              </button>
            );
          })}
        </div>

        {/* Count & Sort */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs font-semibold text-slate-600">
            Showing <strong className="text-slate-900">{filteredPackages.length}</strong> tour package(s)
          </span>
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              aria-label="Sort packages"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="text-xs font-bold text-slate-800 bg-transparent focus:outline-none"
            >
              <option value="recommended">Recommended</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating_desc">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Tour Package Cards */}
        {filteredPackages.length === 0 ? (
          <EmptyState
            icon={<Compass className="w-6 h-6" />}
            title="No Matching Tour Packages"
            description="Try adjusting your search keywords, destination, price range, or duration filters."
            actionLabel="Reset All Filters"
            onAction={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedDestinationFilter('All');
              setPriceFilter('all');
              setDurationFilter('all');
            }}
          />
        ) : (
          <div className="space-y-3.5">
            {filteredPackages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                onSelect={openPackageDetail}
                isWishlisted={wishlistIds.includes(pkg.id)}
                onToggleWishlist={toggleWishlist}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  // WISHLIST PAGE
  const renderWishlistPage = () => {
    const wishlistedPackages = PACKAGES_DATA.filter((p) => wishlistIds.includes(p.id));

    return (
      <div className="p-4 space-y-4 pb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Saved Wishlist</h2>
            <p className="text-xs text-slate-500">Compare and book your favorite travel experiences</p>
          </div>
          <Badge variant="ocean">{wishlistedPackages.length} Saved</Badge>
        </div>

        {wishlistedPackages.length === 0 ? (
          <EmptyState
            icon={<Heart className="w-6 h-6" />}
            title="Your Wishlist is Empty"
            description="Tap the heart icon on any tour package card to save it here for quick comparison."
            actionLabel="Explore Tours"
            onAction={() => setActiveTab('explore')}
          />
        ) : (
          <div className="space-y-3.5">
            {wishlistedPackages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                onSelect={openPackageDetail}
                isWishlisted={true}
                onToggleWishlist={toggleWishlist}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  // MY TRIPS PAGE (UPCOMING, COMPLETED, CANCELLED + VERIFIED LOOKUP)
  const renderMyTripsPage = () => {
    const unlockedBookings = bookings.filter((b) => verifiedBookingRefs.includes(b.bookingReference));
    const filteredTrips = unlockedBookings.filter((b) => b.tripCategory === tripSubTab);

    return (
      <div className="p-4 space-y-4 pb-8">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">My Trips</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your reservations or retrieve any guest booking with your Booking Reference.
          </p>
        </div>

        {/* Trip Category Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-200/70">
          {(
            [
              { id: 'upcoming', label: 'Upcoming' },
              { id: 'completed', label: 'Completed' },
              { id: 'cancelled', label: 'Cancelled' }
            ] as const
          ).map((tab) => {
            const count = unlockedBookings.filter((b) => b.tripCategory === tab.id).length;
            const active = tripSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTripSubTab(tab.id)}
                className={`py-2 px-2 rounded-lg text-xs font-bold transition ${
                  active ? 'bg-white text-[#0B2545] shadow-2xs' : 'text-slate-600'
                }`}
              >
                {tab.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Verified Trips List */}
        {filteredTrips.length > 0 ? (
          <div className="space-y-3">
            {filteredTrips.map((b) => (
              <div
                key={b.bookingReference}
                className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#0B2545]">{b.bookingReference}</span>
                  <Badge
                    variant={
                      b.tripCategory === 'cancelled'
                        ? 'error'
                        : b.tripCategory === 'completed'
                        ? 'success'
                        : 'warning'
                    }
                  >
                    {b.bookingStatus}
                  </Badge>
                </div>

                <div className="flex gap-3">
                  <img
                    src={b.packageImage}
                    alt={b.packageName}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-slate-900 leading-snug">{b.packageName}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{b.destination}</div>
                    <div className="text-[11px] text-slate-600 mt-1">
                      Payment: <strong>{b.paymentStatus}</strong>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div>
                    <div className="text-[10px] text-slate-400">Departure</div>
                    <div className="font-bold text-slate-800">{formatDateReadable(b.departureDate)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Total Amount</div>
                    <div className="font-bold text-[#0B2545]">{formatIDR(b.totalAmount)}</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStandalone({ type: 'bookingDetail', bookingReference: b.bookingReference })}
                  className="w-full py-2.5 rounded-xl bg-[#E7F3F8] text-[#136F99] text-xs font-bold"
                >
                  View Booking Details
                </button>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Briefcase className="w-6 h-6" />}
            title={`No ${tripSubTab.charAt(0).toUpperCase() + tripSubTab.slice(1)} Trips`}
            description={
              tripSubTab === 'upcoming'
                ? 'Book a tour package or retrieve an existing reservation below using your Booking Reference.'
                : `You have no ${tripSubTab} reservations to display.`
            }
            actionLabel={tripSubTab === 'upcoming' ? 'Explore Packages' : undefined}
            onAction={tripSubTab === 'upcoming' ? () => setActiveTab('explore') : undefined}
          />
        )}

        {/* Guest Booking Lookup Form */}
        <form
          onSubmit={handleLookupBooking}
          className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3"
        >
          <div>
            <h3 className="text-sm font-bold text-slate-900">Retrieve Guest Booking</h3>
            <p className="text-[11px] text-slate-500">
              Enter your Booking Reference and Email or Phone number used during checkout.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Booking Reference</label>
            <input
              type="text"
              value={lookupRef}
              onChange={(e) => setLookupRef(e.target.value.toUpperCase())}
              placeholder="e.g., ASR-2611-XXXXXX"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-900 focus:outline-none focus:border-[#136F99]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email or Phone Number</label>
            <input
              type="text"
              value={lookupContact}
              onChange={(e) => setLookupContact(e.target.value)}
              placeholder="Enter email or phone used at checkout"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#136F99]"
            />
          </div>

          {lookupError && <AlertBanner type="error">{lookupError}</AlertBanner>}

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-[#0B2545] text-white text-xs font-bold shadow-xs hover:bg-[#06172D] active:scale-[0.99] transition"
          >
            Find & Unlock Booking
          </button>
        </form>
      </div>
    );
  };

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
        {/* Brand Header with Notification & Profile Shortcuts */}
        <header className="app-header px-4 py-3 flex items-center justify-between">
          <div onClick={() => setActiveTab('home')} className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-[#0B2545] text-white flex items-center justify-center shadow-xs">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-black tracking-tight text-[#0B2545] leading-none">ASRIVA</div>
              <div className="text-[10px] font-bold tracking-widest text-[#136F99] mt-0.5">TRAVEL & TOURS</div>
            </div>
          </div>

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
              onClick={() => setActiveTab('profile')}
              className="w-9 h-9 rounded-xl bg-[#E7F3F8] text-[#0B2545] flex items-center justify-center font-bold text-xs"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Scrollable Active Page Content */}
        <main className="app-content">
          {activeTab === 'home' && renderHomePage()}
          {activeTab === 'explore' && renderExplorePage()}
          {activeTab === 'wishlist' && renderWishlistPage()}
          {activeTab === 'bookings' && renderMyTripsPage()}
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
