import type { DestinationInfo } from '../types/travel.types';

export const DESTINATIONS_DATA: DestinationInfo[] = [
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
