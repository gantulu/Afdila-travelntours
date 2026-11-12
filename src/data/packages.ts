import type { TravelPackage } from '../types/travel.types';

export const PACKAGES_DATA: TravelPackage[] = [
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
