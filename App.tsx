```react
import React, { useState, useEffect, useMemo } from 'react';
import {
  MapPin,
  Search,
  Home,
  Compass,
  Briefcase,
  User,
  ChevronLeft,
  Star,
  Clock,
  Calendar,
  Users,
  Check,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  ShieldCheck,
  CreditCard,
  Wallet,
  Building2,
  QrCode,
  Sparkles,
  Heart,
  Share2,
  Info,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Phone,
  Mail,
  HelpCircle,
  FileText,
  Palmtree,
  Mountain,
  Camera,
  Ship,
  Utensils,
  Award,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

// ============================================================================
// MOCK DATA: DESTINASI & PAKET WISATA INDONESIA
// ============================================================================

const CATEGORIES = [
  { id: 'all', name: 'Semua', icon: Sparkles },
  { id: 'beach', name: 'Pantai & Laut', icon: Palmtree },
  { id: 'mountain', name: 'Gunung & Alam', icon: Mountain },
  { id: 'culture', name: 'Budaya & Sejarah', icon: Camera },
  { id: 'island', name: 'Island Hopping', icon: Ship },
  { id: 'culinary', name: 'Kuliner & Kota', icon: Utensils },
];

const DESTINATIONS = [
  {
    id: 'dest-bali',
    name: 'Nusa Penida & Ubud',
    province: 'Bali',
    country: 'Indonesia',
    rating: 4.9,
    reviewsCount: 1240,
    heroImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=80',
    description:
      'Perpaduan sempurna antara tebing kapur dramatis di pesisir selatan Bali dan ketenangan sawah terasering serta budaya spiritual Ubud yang memikat hati wisatawan dunia.',
    bestTime: 'April - Oktober',
    weather: '28°C Cerah',
    highlights: [
      'Tebing Kelingking & Broken Beach',
      'Terasering Sawah Tegalalang',
      'Snorkeling bersama Manta Ray',
      'Upacara Melukat & Tari Kecak Uluwatu',
    ],
  },
  {
    id: 'dest-labuanbajo',
    name: 'Labuan Bajo & Komodo',
    province: 'Nusa Tenggara Timur',
    country: 'Indonesia',
    rating: 4.95,
    reviewsCount: 980,
    heroImage: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1000&q=80',
    description:
      'Gerbang menuju Taman Nasional Komodo yang ikonik. Nikmati pengalaman berlayar dengan kapal Phinisi mewah melintasi gugusan pulau eksotis, pantai pasir merah muda, dan habitat purba Komodo.',
    bestTime: 'Mei - November',
    weather: '30°C Tropis',
    highlights: [
      'Puncak Pulau Padar saat Matahari Terbit',
      'Pink Beach yang Langka',
      'Trekking bersama Komodo di Pulau Rinca',
      'Taka Makassar & Manta Point',
    ],
  },
  {
    id: 'dest-bromo',
    name: 'Bromo & Kawah Ijen',
    province: 'Jawa Timur',
    country: 'Indonesia',
    rating: 4.85,
    reviewsCount: 1520,
    heroImage: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1000&q=80',
    description:
      'Petualangan epik melintasi lautan pasir vulkanik Gunung Bromo dengan Jeep 4x4 dan menyaksikan fenomena alam langka Api Biru (Blue Fire) di kawah asam terbesar dunia, Kawah Ijen.',
    bestTime: 'Juni - September',
    weather: '14°C Sejuk',
    highlights: [
      'Sunrise di Bukit Penanjakan',
      'Eksplorasi Lautan Pasir & Bukit Teletubbies',
      'Fenomena Blue Fire Kawah Ijen',
      'Danau Kawah Toska yang Memukau',
    ],
  },
  {
    id: 'dest-rajaampat',
    name: 'Raja Ampat & Wayag',
    province: 'Papua Barat Daya',
    country: 'Indonesia',
    rating: 5.0,
    reviewsCount: 640,
    heroImage: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=1000&q=80',
    description:
      'Surga tersembunyi di ujung timur Indonesia dengan keanekaragaman hayati bawah laut terkaya di bumi. Gugusan pulau karst hijau di atas air kristal sebening kaca.',
    bestTime: 'Oktober - April',
    weather: '29°C Hangat',
    highlights: [
      'Puncak Karst Wayag & Piaynemo',
      'Diving & Snorkeling di Yenbuba',
      'Pasir Timbul Mansuar',
      'Desa Wisata Arborek',
    ],
  },
  {
    id: 'dest-jogja',
    name: 'Yogyakarta & Borobudur',
    province: 'DI Yogyakarta',
    country: 'Indonesia',
    rating: 4.8,
    reviewsCount: 2100,
    heroImage: 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?auto=format&fit=crop&w=1000&q=80',
    description:
      'Jantung kebudayaan Jawa yang hangat. Jelajahi kemegahan Candi Borobudur dan Prambanan, susuri lorong sejarah Keraton, hingga mencicipi kelezatan kuliner tradisional legendaris.',
    bestTime: 'Sepanjang Tahun',
    weather: '27°C Cerah',
    highlights: [
      'Sunrise Candi Borobudur dari Punthuk Setumbu',
      'Wisata Sejarah Keraton & Taman Sari',
      'Petualangan Jeep Lava Tour Merapi',
      'Wisata Kuliner Gudeg & Kopi Joss',
    ],
  },
];

const TOURS = [
  {
    id: 'tour-1',
    destinationId: 'dest-labuanbajo',
    title: '3H2M Sailing Komodo Luxury Phinisi',
    location: 'Labuan Bajo, NTT',
    category: 'island',
    durationDays: 3,
    durationLabel: '3 Hari 2 Malam',
    departurePoint: 'Pelabuhan Marina Labuan Bajo',
    pricePerPerson: 3850000,
    originalPrice: 4500000,
    rating: 4.95,
    reviewsCount: 342,
    popularityScore: 98,
    isFeatured: true,
    isRecommended: true,
    badge: 'Terlaris',
    images: [
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    ],
    availableDates: ['2026-11-20', '2026-11-27', '2026-12-04', '2026-12-11', '2026-12-18'],
    description:
      'Nikmati pelayaran eksklusif selama 3 hari 2 malam menggunakan kapal Phinisi modern ber-AC. Mengunjungi 9 destinasi ikonik di Taman Nasional Komodo lengkap dengan dokumentasi drone dan makan fullboard.',
    itinerary: [
      {
        day: 'Hari 1',
        title: 'Pulau Kelor – Manjarite – Pulau Kalong',
        desc: 'Penjemputan bandara/hotel, trekking ringan di Pulau Kelor, snorkeling di Manjarite, dan menikmati sunset ribuan kelelawar di Pulau Kalong.',
      },
      {
        day: 'Hari 2',
        title: 'Pulau Padar – Pink Beach – Pulau Komodo – Manta Point',
        desc: 'Sunrise trekking di Puncak Padar, bersantai di Pink Beach, bertemu Komodo bersama ranger, dan berenang bersama Manta Ray.',
      },
      {
        day: 'Hari 3',
        title: 'Pulau Kanawa – Kembali ke Labuan Bajo',
        desc: 'Snorkeling santai di terumbu karang Pulau Kanawa sebelum berlayar kembali menuju Pelabuhan Labuan Bajo.',
      },
    ],
    included: [
      'Kabin Phinisi AC & Kamar Mandi Dalam',
      'Makan 7x (Fullboard) + Kopi, Teh & Camilan',
      'Antar-jemput Bandara Komodo / Hotel',
      'Alat Snorkeling & Pelampung',
      'Dokumentasi Profesional (Drone, GoPro, Mirrorless)',
      'Pemandu Wisata Lokal Berlisensi',
    ],
    excluded: [
      'Tiket Pesawat menuju Labuan Bajo',
      'Tiket Masuk Taman Nasional Komodo (WNI ~Rp250.000)',
      'Pengeluaran pribadi & tipping kru kapal',
    ],
    importantInfo: [
      'Peserta wajib membawa kartu identitas (KTP/Paspor) yang masih berlaku.',
      'Disarankan menggunakan sepatu trekking ringan untuk pendakian Pulau Padar.',
      'Jadwal pelayaran dapat berubah menyesuaikan kondisi cuaca dan arus laut.',
    ],
  },
  {
    id: 'tour-2',
    destinationId: 'dest-bali',
    title: 'Eksplorasi Nusa Penida Barat & Timur 1 Hari',
    location: 'Nusa Penida, Bali',
    category: 'beach',
    durationDays: 1,
    durationLabel: '1 Hari Penuh (10 Jam)',
    departurePoint: 'Pelabuhan Sanur, Denpasar',
    pricePerPerson: 750000,
    originalPrice: 950000,
    rating: 4.88,
    reviewsCount: 518,
    popularityScore: 95,
    isFeatured: true,
    isRecommended: false,
    badge: 'Hemat 20%',
    images: [
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1573790387438-4da905039392?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=1000&q=80',
    ],
    availableDates: ['2026-11-15', '2026-11-16', '2026-11-17', '2026-11-18', '2026-11-19', '2026-11-20'],
    description:
      'Tur privat sehari penuh menjelajahi spot paling fotogenik di Nusa Penida tanpa terburu-buru. Sudah termasuk tiket fast boat PP, mobil privat ber-AC, makan siang tepi pantai, dan supir sekaligus fotografer.',
    itinerary: [
      {
        day: '07:30',
        title: 'Keberangkatan Fast Boat dari Sanur',
        desc: 'Check-in di Pelabuhan Sanur dan menyeberang menuju Pelabuhan Toyapakeh selama 45 menit.',
      },
      {
        day: '09:30',
        title: 'Diamond Beach & Atuh Beach (Sisi Timur)',
        desc: 'Menuruni tangga tebing ikonik Diamond Beach dengan pemandangan pasir putih dan gugusan karang.',
      },
      {
        day: '12:30',
        title: 'Makan Siang & Kelingking Beach (Sisi Barat)',
        desc: 'Makan siang menu lokal, dilanjutkan ke tebing T-Rex Kelingking Beach, Broken Beach, dan Angel Billabong.',
      },
      {
        day: '16:30',
        title: 'Kembali ke Sanur',
        desc: 'Penyeberangan kembali ke Pulau Bali dan pengantaran ke hotel area Kuta/Seminyak/Ubud.',
      },
    ],
    included: [
      'Tiket Fast Boat Sanur – Nusa Penida (PP)',
      'Mobil Privat AC + BBM selama di Nusa Penida',
      'Makan Siang di Restoran Lokal',
      'Tiket Masuk Semua Objek Wisata & Retribusi',
      'Air Mineral & Asuransi Penyeberangan',
    ],
    excluded: [
      'Antar-jemput hotel di Bali (tersedia sebagai opsi tambahan)',
      'Sewa ayunan / spot foto berbayar di Rumah Pohon Molenteng',
    ],
    importantInfo: [
      'Tidak disarankan bagi ibu hamil atau memiliki riwayat gangguan jantung/lutut.',
      'Gunakan tabir surya, topi, dan alas kaki yang nyaman untuk medan berbatu.',
    ],
  },
  {
    id: 'tour-3',
    destinationId: 'dest-bromo',
    title: 'Bromo Midnight Sunrise Jeep Adventure',
    location: 'Probolinggo & Malang, Jawa Timur',
    category: 'mountain',
    durationDays: 1,
    durationLabel: '1 Hari (Midnight Tour)',
    departurePoint: 'Stasiun / Hotel Kota Malang',
    pricePerPerson: 525000,
    originalPrice: 650000,
    rating: 4.91,
    reviewsCount: 689,
    popularityScore: 94,
    isFeatured: false,
    isRecommended: true,
    badge: 'Favorit',
    images: [
      'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1000&q=80',
    ],
    availableDates: ['2026-11-15', '2026-11-17', '2026-11-19', '2026-11-21', '2026-11-23'],
    description:
      'Saksikan keajaiban matahari terbit di atas lautan awan Gunung Bromo menggunakan Jeep 4x4 klasik. Jelajahi Kawah Bromo, Pura Luhur Poten, Pasir Berbisik, hingga Padang Savana Teletubbies.',
    itinerary: [
      {
        day: '00:15',
        title: 'Penjemputan di Area Kota Malang',
        desc: 'Berangkat menuju pos transit Wonokitri / Tumpang untuk berganti kendaraan Jeep 4x4.',
      },
      {
        day: '03:30',
        title: 'Golden Sunrise di Bukit Kingkong / Penanjakan',
        desc: 'Menikmati hangatnya kopi lokal sambil menanti matahari terbit berlatar Gunung Bromo, Batok, dan Semeru.',
      },
      {
        day: '06:00',
        title: 'Kawah Bromo, Pasir Berbisik & Savana',
        desc: 'Mendaki tangga menuju bibir Kawah Bromo dan sesi foto di Lautan Pasir serta Bukit Teletubbies.',
      },
      {
        day: '11:00',
        title: 'Kembali ke Malang',
        desc: 'Perjalanan pulang dan pengantaran kembali ke hotel atau stasiun di Malang.',
      },
    ],
    included: [
      'Transportasi Antar-Jemput Area Kota Malang',
      'Sewa Jeep Hardtop 4x4 + BBM + Driver Berpengalaman',
      'Tiket Masuk Taman Nasional Bromo Tengger Semeru (WNI)',
      'Masker pelindung debu & Air Mineral',
    ],
    excluded: [
      'Sewa kuda menuju kaki tangga Kawah Bromo (~Rp150.000 PP)',
      'Makan pagi & pengeluaran pribadi',
      'Biaya tambahan tiket WNA',
    ],
    importantInfo: [
      'Suhu di puncak dapat mencapai 5°C - 10°C. Wajib membawa jaket tebal, sarung tangan, dan kupluk.',
      'Penjemputan di luar area pusat kota Malang dikenakan biaya penyesuaian.',
    ],
  },
  {
    id: 'tour-4',
    destinationId: 'dest-rajaampat',
    title: '4H3M Raja Ampat Piaynemo & Wayag Escape',
    location: 'Waisai, Raja Ampat',
    category: 'island',
    durationDays: 4,
    durationLabel: '4 Hari 3 Malam',
    departurePoint: 'Pelabuhan Rakyat Sorong',
    pricePerPerson: 6950000,
    originalPrice: 7800000,
    rating: 4.98,
    reviewsCount: 215,
    popularityScore: 92,
    isFeatured: true,
    isRecommended: true,
    badge: 'Eksklusif',
    images: [
      'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1000&q=80',
    ],
    availableDates: ['2026-11-25', '2026-12-05', '2026-12-15', '2026-12-26'],
    description:
      'Paket lengkap menjelajahi mahakarya alam Papua Barat. Menginap di resort tepi pantai di Pulau Kri, mendaki puncak Piaynemo dan Wayag, serta snorkeling di taman laut kelas dunia.',
    itinerary: [
      {
        day: 'Hari 1',
        title: 'Sorong – Waisai – Pulau Friwen',
        desc: 'Penjemputan Bandara DEO Sorong, menyeberang ke Waisai dengan kapal cepat VIP, check-in resort dan sunset di Friwen.',
      },
      {
        day: 'Hari 2',
        title: 'Puncak Piaynemo – Telaga Bintang – Desa Arborek',
        desc: 'Trekking ke panorama ikonik Piaynemo, melihat laguna berbentuk bintang, dan berinteraksi dengan warga Desa Arborek.',
      },
      {
        day: 'Hari 3',
        title: 'Eksplorasi Kepulauan Wayag & Pos Konservasi Hiu',
        desc: 'Perjalanan speed boat menuju gugusan karst Wayag, mendaki puncak tertinggi, dan berenang bersama baby shark.',
      },
      {
        day: 'Hari 4',
        title: 'Pasir Timbul – Kembali ke Sorong',
        desc: 'Sesi foto di Pasir Timbul Mansuar sebelum kembali ke Waisai dan menyeberang ke Sorong.',
      },
    ],
    included: [
      'Akomodasi Beach Resort / Overwater Bungalow 3 Malam',
      'Speed Boat Privat selama tur + BBM',
      'Tiket Kapal Cepat VIP Sorong – Waisai (PP)',
      'Makan 3x Sehari + Camilan & Air Mineral',
      'Alat Snorkeling & Dokumentasi Lengkap',
    ],
    excluded: [
      'Tiket Pesawat menuju Sorong (SOQ)',
      'Kartu Jasa Lingkungan / PIN Raja Ampat (Rp500.000 WNI)',
    ],
    importantInfo: [
      'Disarankan mengambil penerbangan tiba di Sorong sebelum pukul 08:00 WIT.',
      'Wajib menjaga kelestarian terumbu karang dan tidak menginjak karang saat snorkeling.',
    ],
  },
  {
    id: 'tour-5',
    destinationId: 'dest-jogja',
    title: 'Heritage Borobudur Sunrise & Merapi Lava Tour',
    location: 'Yogyakarta & Magelang',
    category: 'culture',
    durationDays: 1,
    durationLabel: '1 Hari (12 Jam)',
    departurePoint: 'Hotel / Stasiun Tugu Yogyakarta',
    pricePerPerson: 620000,
    originalPrice: 750000,
    rating: 4.86,
    reviewsCount: 412,
    popularityScore: 89,
    isFeatured: false,
    isRecommended: true,
    badge: 'Budaya',
    images: [
      'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=1000&q=80',
    ],
    availableDates: ['2026-11-15', '2026-11-16', '2026-11-18', '2026-11-20', '2026-11-22'],
    description:
      'Kombinasi wisata sejarah dan petualangan di Yogyakarta. Nikmati siluet Candi Borobudur saat fajar, naik ke struktur candi bersama pemandu, dilanjutkan off-road Jeep menyusuri lereng Gunung Merapi.',
    itinerary: [
      {
        day: '04:00',
        title: 'Sunrise Punthuk Setumbu',
        desc: 'Menyaksikan matahari terbit dengan latar belakang Candi Borobudur dan Gunung Merapi-Merbabu.',
      },
      {
        day: '07:30',
        title: 'Eksplorasi Struktur Candi Borobudur',
        desc: 'Tur edukasi naik ke pelataran stupa Candi Borobudur ditemani pemandu resmi candi.',
      },
      {
        day: '11:30',
        title: 'Makan Siang & Jeep Lava Tour Merapi',
        desc: 'Menyusuri Kali Kuning, Bunker Kaliadem, dan Museum Sisa Hartaku menggunakan Jeep terbuka.',
      },
      {
        day: '15:30',
        title: 'Wisata Oleh-oleh & Kembali ke Hotel',
        desc: 'Singgah di pusat Bakpia Pathok legendaris sebelum diantar kembali ke hotel.',
      },
    ],
    included: [
      'Mobil Privat Nyaman + Supir Ramah + BBM',
      'Tiket Naik Struktur Candi Borobudur (WNI)',
      'Sewa Jeep Merapi Lava Tour (Medium Route)',
      'Makan Siang Khas Jawa & Air Mineral',
    ],
    excluded: [
      'Pengeluaran pribadi & belanja oleh-oleh',
      'Selisih tiket masuk wisatawan mancanegara',
    ],
    importantInfo: [
      'Kuota naik ke struktur Candi Borobudur terbatas setiap harinya, pemesanan disarankan H-3.',
      'Wajib menggunakan sandal khusus (Upanat) yang disediakan pengelola candi.',
    ],
  },
  {
    id: 'tour-6',
    destinationId: 'dest-bali',
    title: 'Ubud Hidden Gems, Terasering & Kuliner Bali',
    location: 'Ubud, Gianyar, Bali',
    category: 'culinary',
    durationDays: 1,
    durationLabel: '1 Hari (9 Jam)',
    departurePoint: 'Hotel Area Kuta / Seminyak / Ubud',
    pricePerPerson: 590000,
    originalPrice: 700000,
    rating: 4.89,
    reviewsCount: 276,
    popularityScore: 87,
    isFeatured: false,
    isRecommended: false,
    badge: 'Kuliner & Alam',
    images: [
      'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1000&q=80',
    ],
    availableDates: ['2026-11-15', '2026-11-16', '2026-11-17', '2026-11-19', '2026-11-21'],
    description:
      'Jelajahi sisi autentik Ubud mulai dari hutan monyet keramat, sawah terasering Tegalalang, air terjun tersembunyi, hingga mencicipi Bebek Betutu dan kopi Luwak asli.',
    itinerary: [
      {
        day: '08:30',
        title: 'Sacred Monkey Forest & Puri Saren Ubud',
        desc: 'Berjalan di tengah hutan lindung dengan arsitektur pura kuno yang megah.',
      },
      {
        day: '11:00',
        title: 'Terasering Tegalalang & Perkebunan Kopi',
        desc: 'Menikmati panorama sawah hijau bertingkat dan sesi mencicipi 12 varian teh dan kopi Bali.',
      },
      {
        day: '13:30',
        title: 'Makan Siang Bebek Tepi Sawah & Air Terjun Tegenungan',
        desc: 'Menyantap hidangan khas Ubud di tepi sawah dan bersantai di Air Terjun Tegenungan.',
      },
    ],
    included: [
      'Transportasi Privat AC + BBM + Parkir',
      'Makan Siang Set Menu Khas Bali',
      'Tiket Masuk Semua Destinasi Wisata',
      'Sesi Coffee & Tea Tasting',
    ],
    excluded: [
      'Wahana Bali Swing & foto berbayar',
      'Keperluan pribadi',
    ],
    importantInfo: [
      'Gunakan pakaian sopan yang menutupi bahu dan lutut saat memasuki area pura.',
    ],
  },
];

const POPULAR_ACTIVITIES = [
  {
    id: 'act-1',
    title: 'Snorkeling Manta Point',
    location: 'Labuan Bajo',
    price: 450000,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
    tourId: 'tour-1',
  },
  {
    id: 'act-2',
    title: 'Jeep Lava Tour Merapi',
    location: 'Yogyakarta',
    price: 350000,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=600&q=80',
    tourId: 'tour-5',
  },
  {
    id: 'act-3',
    title: 'Bromo Sunrise 4x4',
    location: 'Jawa Timur',
    price: 525000,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&w=600&q=80',
    tourId: 'tour-3',
  },
  {
    id: 'act-4',
    title: 'Ubud Coffee & Swing',
    location: 'Bali',
    price: 380000,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1573790387438-4da905039392?auto=format&fit=crop&w=600&q=80',
    tourId: 'tour-6',
  },
];

const PAYMENT_METHODS = [
  {
    id: 'qris',
    name: 'QRIS Instan',
    subtitle: 'GoPay, OVO, DANA, ShopeePay, Mobile Banking',
    icon: QrCode,
    fee: 0,
  },
  {
    id: 'va_bca',
    name: 'Virtual Account BCA',
    subtitle: 'Verifikasi otomatis tanpa perlu unggah bukti',
    icon: Building2,
    fee: 4500,
  },
  {
    id: 'va_mandiri',
    name: 'Virtual Account Mandiri',
    subtitle: 'Transfer cepat via Livin’ by Mandiri / ATM',
    icon: Building2,
    fee: 4500,
  },
  {
    id: 'ewallet',
    name: 'Dompet Digital (GoPay / OVO)',
    subtitle: 'Bayar langsung dengan saldo e-wallet',
    icon: Wallet,
    fee: 2500,
  },
  {
    id: 'card',
    name: 'Kartu Kredit / Debit',
    subtitle: 'Visa, Mastercard, JCB (Cicilan 0% tersedia)',
    icon: CreditCard,
    fee: 15000,
  },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const formatIDR = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDateIndo = (dateStr) => {
  if (!dateStr) return '-';
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
  ];
  const [y, m, d] = dateStr.split('-');
  return `${parseInt(d, 10)} ${months[parseInt(m, 10) - 1]} ${y}`;
};

const generateBookingRef = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'NWS-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// ============================================================================
// REUSABLE UI COMPONENTS
// ============================================================================

const ImageWithFallback = ({ src, alt, className }) => {
  const [imgSrc, setImgSrc] = useState(src);
  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() =>
        setImgSrc(
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
        )
      }
    />
  );
};

const ToastNotification = ({ toast, onClose }) => {
  if (!toast) return null;
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[400px] animate-fade-in">
      <div
        className={`flex items-center justify-between px-4 py-3 rounded-2xl shadow-xl border backdrop-blur-md ${
          toast.type === 'error'
            ? 'bg-rose-950/90 text-white border-rose-700'
            : 'bg-slate-900/95 text-white border-slate-700'
        }`}
      >
        <div className="flex items-center gap-2.5 text-sm font-medium">
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN APPLICATION COMPONENT
// ============================================================================

export default function App() {
  // Navigation & Routing State
  // Pages: 'home', 'explore', 'my-trips', 'profile', 'destination-detail', 'tour-detail', 'booking', 'payment', 'confirmation'
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedDestinationId, setSelectedDestinationId] = useState(null);
  const [selectedTourId, setSelectedTourId] = useState(null);
  const [wishlist, setWishlist] = useState(['tour-1', 'tour-4']);
  const [toast, setToast] = useState(null);

  // Explore & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [filterDuration, setFilterDuration] = useState('all');
  const [filterMaxPrice, setFilterMaxPrice] = useState(10000000);
  const [sortBy, setSortBy] = useState('popular'); // 'popular' | 'price-asc' | 'price-desc' | 'rating'
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Booking Flow State
  const [bookingDraft, setBookingDraft] = useState({
    tourId: null,
    date: '',
    participants: 2,
    includeInsurance: true,
    includePickup: false,
    guestName: 'Raka Pratama',
    guestEmail: 'raka.pratama@email.id',
    guestPhone: '081234567890',
    specialNotes: '',
  });

  // Payment & Confirmation State
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('qris');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null); // 'success' | 'failed'
  const [latestBooking, setLatestBooking] = useState(null);

  // Bookings History State (persisted in localStorage)
  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem('nws_wanderlust_bookings_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore storage error
    }
    return [
      {
        id: 'NWS-89K2LP',
        tourId: 'tour-5',
        tourTitle: 'Heritage Borobudur Sunrise & Merapi Lava Tour',
        tourLocation: 'Yogyakarta & Magelang',
        tourImage:
          'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?auto=format&fit=crop&w=800&q=80',
        date: '2026-09-14',
        participants: 2,
        guestName: 'Raka Pratama',
        guestEmail: 'raka.pratama@email.id',
        guestPhone: '081234567890',
        totalAmount: 1290000,
        paymentMethod: 'QRIS Instan',
        status: 'COMPLETED',
        createdAt: '2026-09-01',
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('nws_wanderlust_bookings_v1', JSON.stringify(bookings));
    } catch (e) {
      // ignore storage error
    }
  }, [bookings]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3200);
  };

  const toggleWishlist = (tourId, e) => {
    if (e) e.stopPropagation();
    setWishlist((prev) => {
      const exists = prev.includes(tourId);
      if (exists) {
        showToast('Dihapus dari daftar keinginan');
        return prev.filter((id) => id !== tourId);
      } else {
        showToast('Disimpan ke daftar keinginan');
        return [...prev, tourId];
      }
    });
  };

  // Navigation Helpers
  const openDestination = (destId) => {
    setSelectedDestinationId(destId);
    setCurrentPage('destination-detail');
  };

  const openTour = (tourId) => {
    setSelectedTourId(tourId);
    setCurrentPage('tour-detail');
  };

  const startBooking = (tour) => {
    setBookingDraft((prev) => ({
      ...prev,
      tourId: tour.id,
      date: tour.availableDates[0] || '2026-11-20',
      participants: 2,
      includeInsurance: true,
      includePickup: false,
    }));
    setCurrentPage('booking');
  };

  // Derived Objects
  const activeDestination = useMemo(
    () => DESTINATIONS.find((d) => d.id === selectedDestinationId) || DESTINATIONS[0],
    [selectedDestinationId]
  );

  const activeTour = useMemo(
    () => TOURS.find((t) => t.id === selectedTourId) || TOURS[0],
    [selectedTourId]
  );

  const bookingTour = useMemo(
    () => TOURS.find((t) => t.id === bookingDraft.tourId) || activeTour,
    [bookingDraft.tourId, activeTour]
  );

  // Filtered & Sorted Tours for Explore Page
  const filteredTours = useMemo(() => {
    return TOURS.filter((tour) => {
      const matchesQuery =
        tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || tour.category === selectedCategory;
      const matchesLocation =
        filterLocation === 'all' ||
        tour.location.toLowerCase().includes(filterLocation.toLowerCase());
      const matchesDuration =
        filterDuration === 'all' ||
        (filterDuration === '1day' && tour.durationDays === 1) ||
        (filterDuration === 'multiday' && tour.durationDays > 1);
      const matchesPrice = tour.pricePerPerson <= filterMaxPrice;

      return (
        matchesQuery &&
        matchesCategory &&
        matchesLocation &&
        matchesDuration &&
        matchesPrice
      );
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.pricePerPerson - b.pricePerPerson;
      if (sortBy === 'price-desc') return b.pricePerPerson - a.pricePerPerson;
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.popularityScore - a.popularityScore;
    });
  }, [
    searchQuery,
    selectedCategory,
    filterLocation,
    filterDuration,
    filterMaxPrice,
    sortBy,
  ]);

  // Price Calculation for Booking
  const priceBreakdown = useMemo(() => {
    if (!bookingTour) return { base: 0, insurance: 0, pickup: 0, serviceFee: 0, total: 0 };
    const base = bookingTour.pricePerPerson * bookingDraft.participants;
    const insurance = bookingDraft.includeInsurance
      ? 35000 * bookingDraft.participants
      : 0;
    const pickup = bookingDraft.includePickup ? 150000 : 0;
    const serviceFee = 25000;
    const total = base + insurance + pickup + serviceFee;
    return { base, insurance, pickup, serviceFee, total };
  }, [bookingTour, bookingDraft]);

  // ============================================================================
  // PAGE RENDERERS
  // ============================================================================

  // A. HOME PAGE
  const renderHome = () => {
    const featuredTours = TOURS.filter((t) => t.isFeatured);
    const recommendedTours = TOURS.filter((t) => t.isRecommended);

    return (
      <div className="pb-28 space-y-7">
        {/* Top Header */}
        <header className="px-5 pt-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-teal-700 mb-0.5">
              <MapPin className="w-3.5 h-3.5 text-teal-600" />
              <span>Jakarta, Indonesia</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Nusantara<span className="text-teal-600">.</span>Wander
            </h1>
          </div>
          <button
            onClick={() => setCurrentPage('my-trips')}
            className="relative w-10 h-10 rounded-full bg-white border border-slate-200/80 shadow-sm flex items-center justify-center text-slate-700 hover:bg-slate-50 transition"
            aria-label="Perjalanan Saya"
          >
            <Briefcase className="w-5 h-5" />
            {bookings.filter((b) => b.status === 'UPCOMING').length > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-teal-600 ring-2 ring-white" />
            )}
          </button>
        </header>

        {/* Hero Greeting & Search Bar */}
        <section className="px-5 space-y-4">
          <div>
            <p className="text-sm text-slate-500">Halo, Raka Pratama</p>
            <h2 className="text-2xl font-bold text-slate-900 leading-snug mt-0.5">
              Ke mana petualanganmu berikutnya?
            </h2>
          </div>

          <div
            onClick={() => setCurrentPage('explore')}
            className="flex items-center gap-3 bg-white px-4 py-3.5 rounded-2xl shadow-sm border border-slate-200/80 cursor-pointer hover:border-teal-500/50 transition"
          >
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <span className="text-sm text-slate-400 flex-1 truncate">
              Cari destinasi, paket tur, atau aktivitas...
            </span>
            <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
          </div>
        </section>

        {/* Category Shortcuts */}
        <section className="space-y-3">
          <div className="flex gap-2.5 overflow-x-auto px-5 pb-1 no-scrollbar">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setCurrentPage('explore');
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm text-slate-700 hover:border-teal-600 hover:text-teal-700 whitespace-nowrap text-xs font-semibold transition shrink-0"
                >
                  <Icon className="w-4 h-4 text-teal-600" />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Promotional Banner */}
        <section className="px-5">
          <div
            onClick={() => openTour('tour-1')}
            className="relative rounded-3xl overflow-hidden shadow-md cursor-pointer group h-44"
          >
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1000&q=80"
              alt="Promo Sailing Komodo"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/50 to-transparent p-5 flex flex-col justify-between">
              <span className="inline-flex items-center gap-1 self-start px-3 py-1 rounded-full bg-amber-400/95 text-slate-950 text-[11px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3" /> Promo Akhir Tahun
              </span>
              <div className="max-w-[75%]">
                <h3 className="text-white font-bold text-lg leading-tight">
                  Diskon 15% Sailing Komodo Phinisi
                </h3>
                <p className="text-slate-200 text-xs mt-1">
                  Berlayar mewah 3H2M mulai Rp 3,85 Jt/orang
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Destinations */}
        <section className="space-y-3.5">
          <div className="px-5 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Destinasi Populer</h3>
              <p className="text-xs text-slate-500">Surga terindah di nusantara</p>
            </div>
            <button
              onClick={() => setCurrentPage('explore')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800"
            >
              Lihat Semua
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto px-5 pb-2 no-scrollbar">
            {DESTINATIONS.map((dest) => (
              <div
                key={dest.id}
                onClick={() => openDestination(dest.id)}
                className="relative w-44 h-60 rounded-3xl overflow-hidden shadow-md shrink-0 cursor-pointer group"
              >
                <ImageWithFallback
                  src={dest.heroImage}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
                <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm flex items-center gap-1 text-[11px] font-bold text-slate-900">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{dest.rating}</span>
                </div>
                <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                  <h4 className="font-bold text-sm leading-snug line-clamp-1">{dest.name}</h4>
                  <div className="flex items-center gap-1 text-[11px] text-slate-200 mt-0.5">
                    <MapPin className="w-3 h-3 text-teal-400 shrink-0" />
                    <span className="truncate">{dest.province}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Travel Packages */}
        <section className="space-y-3.5">
          <div className="px-5 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Paket Wisata Unggulan</h3>
              <p className="text-xs text-slate-500">Kurasi perjalanan terbaik untukmu</p>
            </div>
            <button
              onClick={() => setCurrentPage('explore')}
              className="text-xs font-semibold text-teal-700"
            >
              Eksplor
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto px-5 pb-2 no-scrollbar">
            {featuredTours.map((tour) => (
              <div
                key={tour.id}
                onClick={() => openTour(tour.id)}
                className="w-72 bg-white rounded-3xl overflow-hidden border border-slate-200/70 shadow-sm shrink-0 cursor-pointer hover:shadow-md transition"
              >
                <div className="relative h-40">
                  <ImageWithFallback
                    src={tour.images[0]}
                    alt={tour.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-teal-600 text-white text-[11px] font-semibold">
                    {tour.badge}
                  </span>
                  <button
                    onClick={(e) => toggleWishlist(tour.id, e)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-700"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        wishlist.includes(tour.id)
                          ? 'fill-rose-500 text-rose-500'
                          : 'text-slate-600'
                      }`}
                    />
                  </button>
                </div>
                <div className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1 truncate">
                      <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      {tour.location}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-slate-800 shrink-0">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {tour.rating}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug">
                    {tour.title}
                  </h4>
                  <div className="pt-2 border-t border-slate-100 flex items-end justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Mulai dari</span>
                      <span className="text-sm font-bold text-teal-700">
                        {formatIDR(tour.pricePerPerson)}
                      </span>
                      <span className="text-[11px] text-slate-400"> /org</span>
                    </div>
                    <span className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
                      {tour.durationDays}H
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Activities */}
        <section className="px-5 space-y-3.5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Aktivitas Populer</h3>
              <p className="text-xs text-slate-500">Pengalaman seru dalam satu hari</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {POPULAR_ACTIVITIES.map((act) => (
              <div
                key={act.id}
                onClick={() => openTour(act.tourId)}
                className="bg-white rounded-2xl p-2.5 border border-slate-200/70 shadow-sm cursor-pointer hover:border-teal-500/50 transition"
              >
                <div className="relative h-24 rounded-xl overflow-hidden mb-2">
                  <ImageWithFallback
                    src={act.image}
                    alt={act.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-slate-950/75 text-white text-[10px] font-semibold flex items-center gap-0.5">
                    <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                    {act.rating}
                  </div>
                </div>
                <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{act.title}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">{act.location}</p>
                <p className="text-xs font-bold text-teal-700 mt-1.5">
                  {formatIDR(act.price)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Recommended Tours List */}
        <section className="px-5 space-y-3.5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Rekomendasi Untukmu</h3>
              <p className="text-xs text-slate-500">Pilihan favorit traveler bulan ini</p>
            </div>
          </div>

          <div className="space-y-3">
            {recommendedTours.map((tour) => (
              <div
                key={tour.id}
                onClick={() => openTour(tour.id)}
                className="flex gap-3.5 bg-white p-3 rounded-3xl border border-slate-200/70 shadow-sm cursor-pointer hover:shadow-md transition"
              >
                <ImageWithFallback
                  src={tour.images[0]}
                  alt={tour.title}
                  className="w-24 h-24 rounded-2xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-medium text-teal-700 truncate">
                        {tour.location}
                      </span>
                      <span className="flex items-center gap-0.5 text-xs font-bold text-slate-800 shrink-0">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {tour.rating}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 line-clamp-2 mt-0.5 leading-snug">
                      {tour.title}
                    </h4>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {tour.durationDays} Hari
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {formatIDR(tour.pricePerPerson)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  };

  // B. EXPLORE PAGE
  const renderExplore = () => {
    const activeFiltersCount =
      (filterLocation !== 'all' ? 1 : 0) +
      (filterDuration !== 'all' ? 1 : 0) +
      (filterMaxPrice < 10000000 ? 1 : 0);

    return (
      <div className="pb-28 min-h-screen flex flex-col">
        {/* Sticky Search & Filter Header */}
        <div className="sticky top-0 z-20 bg-[#F8F9FA]/95 backdrop-blur-md px-5 pt-5 pb-3 border-b border-slate-200/60 space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-slate-900">Eksplor Paket Wisata</h1>
            <span className="text-xs font-medium text-slate-500">
              {filteredTours.length} paket tersedia
            </span>
          </div>

          {/* Search Input */}
          <div className="flex items-center gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari Labuan Bajo, Bromo, Bali..."
                className="w-full pl-10 pr-8 py-3 rounded-2xl bg-white border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilterModal(true)}
              className="relative p-3 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 transition shrink-0"
              aria-label="Filter"
            >
              <SlidersHorizontal className="w-5 h-5" />
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-teal-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat.id
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Sort Bar */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Urutkan:</span>
            </div>
            <div className="flex gap-1.5">
              {[
                { id: 'popular', label: 'Populer' },
                { id: 'price-asc', label: 'Termurah' },
                { id: 'price-desc', label: 'Termahal' },
                { id: 'rating', label: 'Rating' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSortBy(s.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                    sortBy === s.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-200/70 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tour Cards List */}
        <div className="px-5 pt-4 space-y-4 flex-1">
          {filteredTours.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200/70">
              <Compass className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-900">Paket tidak ditemukan</h3>
              <p className="text-xs text-slate-500 mt-1">
                Coba ubah kata kunci pencarian atau atur ulang filter kamu.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setFilterLocation('all');
                  setFilterDuration('all');
                  setFilterMaxPrice(10000000);
                }}
                className="mt-4 px-5 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-semibold"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            filteredTours.map((tour) => (
              <div
                key={tour.id}
                onClick={() => openTour(tour.id)}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/70 shadow-sm cursor-pointer hover:shadow-md transition"
              >
                <div className="relative h-48">
                  <ImageWithFallback
                    src={tour.images[0]}
                    alt={tour.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                  <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-white/95 text-slate-900 text-[11px] font-bold shadow-sm">
                    {tour.badge}
                  </span>
                  <button
                    onClick={(e) => toggleWishlist(tour.id, e)}
                    className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        wishlist.includes(tour.id)
                          ? 'fill-rose-500 text-rose-500'
                          : 'text-slate-700'
                      }`}
                    />
                  </button>
                  <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-white text-xs">
                    <span className="flex items-center gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-teal-400" />
                      {tour.location}
                    </span>
                    <span className="flex items-center gap-1 bg-slate-900/75 px-2 py-0.5 rounded-full font-semibold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {tour.rating} ({tour.reviewsCount})
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <h3 className="font-bold text-base text-slate-900 leading-snug">
                    {tour.title}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-teal-600" />
                      {tour.durationLabel}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-teal-600" />
                      {tour.availableDates.length} Jadwal
                    </span>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      {tour.originalPrice && (
                        <span className="text-xs text-slate-400 line-through block">
                          {formatIDR(tour.originalPrice)}
                        </span>
                      )}
                      <div className="flex items-baseline gap-1">
                        <span className="text-base font-bold text-teal-700">
                          {formatIDR(tour.pricePerPerson)}
                        </span>
                        <span className="text-xs text-slate-500">/ orang</span>
                      </div>
                    </div>
                    <span className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold">
                      Lihat Detail
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Filter Bottom Sheet Modal */}
        {showFilterModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end justify-center">
            <div className="w-full max-w-[430px] bg-white rounded-t-3xl p-6 space-y-5 animate-slide-up">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Filter Pencarian</h3>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="p-2 rounded-full bg-slate-100 text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Filter Location */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Wilayah Destinasi
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'all', label: 'Semua Wilayah' },
                    { id: 'bali', label: 'Bali' },
                    { id: 'labuan bajo', label: 'Labuan Bajo' },
                    { id: 'jawa timur', label: 'Jawa Timur' },
                    { id: 'raja ampat', label: 'Raja Ampat' },
                    { id: 'yogyakarta', label: 'Yogyakarta' },
                  ].map((loc) => (
                    <button
                      key={loc.id}
                      onClick={() => setFilterLocation(loc.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
                        filterLocation === loc.id
                          ? 'bg-teal-600 text-white border-teal-600'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      {loc.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter Duration */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Durasi Perjalanan
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'all', label: 'Semua' },
                    { id: '1day', label: '1 Hari (Day Trip)' },
                    { id: 'multiday', label: 'Multi-Hari (2H+)' },
                  ].map((dur) => (
                    <button
                      key={dur.id}
                      onClick={() => setFilterDuration(dur.id)}
                      className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition ${
                        filterDuration === dur.id
                          ? 'bg-teal-600 text-white border-teal-600'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      {dur.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter Max Price */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Maksimal Harga / Orang
                  </label>
                  <span className="text-sm font-bold text-teal-700">
                    {formatIDR(filterMaxPrice)}
                  </span>
                </div>
                <input
                  type="range"
                  min={500000}
                  max={10000000}
                  step={250000}
                  value={filterMaxPrice}
                  onChange={(e) => setFilterMaxPrice(Number(e.target.value))}
                  className="w-full accent-teal-600"
                />
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Rp 500 rb</span>
                  <span>Rp 10 jt</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setFilterLocation('all');
                    setFilterDuration('all');
                    setFilterMaxPrice(10000000);
                  }}
                  className="flex-1 py-3.5 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-700"
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="flex-[2] py-3.5 rounded-2xl bg-teal-600 text-white text-sm font-semibold shadow-md"
                >
                  Terapkan Filter
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // C. DESTINATION DETAIL PAGE
  const renderDestinationDetail = () => {
    const relatedTours = TOURS.filter((t) => t.destinationId === activeDestination.id);

    return (
      <div className="pb-12 bg-[#F8F9FA] min-h-screen">
        {/* Hero Image */}
        <div className="relative h-80">
          <ImageWithFallback
            src={activeDestination.heroImage}
            alt={activeDestination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-slate-950/30" />

          {/* Top Nav */}
          <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
            <button
              onClick={() => setCurrentPage('home')}
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-900 shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => showToast('Tautan destinasi disalin')}
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-900 shadow-sm"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Destination Info Overlay */}
          <div className="absolute bottom-6 left-5 right-5 text-white">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/90 text-white text-[11px] font-semibold">
                {activeDestination.province}
              </span>
              <span className="flex items-center gap-1 text-xs font-semibold bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                {activeDestination.rating} ({activeDestination.reviewsCount} ulasan)
              </span>
            </div>
            <h1 className="text-2xl font-bold leading-tight">{activeDestination.name}</h1>
          </div>
        </div>

        {/* Content Body */}
        <div className="px-5 -mt-3 relative z-10 space-y-6">
          {/* Quick Meta Cards */}
          <div className="grid grid-cols-2 gap-3 bg-white p-4 rounded-3xl shadow-sm border border-slate-200/70">
            <div>
              <span className="text-[11px] text-slate-400 block">Waktu Terbaik</span>
              <span className="text-xs font-bold text-slate-900 mt-0.5 block">
                {activeDestination.bestTime}
              </span>
            </div>
            <div className="border-l border-slate-100 pl-3">
              <span className="text-[11px] text-slate-400 block">Cuaca Rata-rata</span>
              <span className="text-xs font-bold text-slate-900 mt-0.5 block">
                {activeDestination.weather}
              </span>
            </div>
          </div>

          {/* Description */}
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">Tentang Destinasi</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {activeDestination.description}
            </p>
          </section>

          {/* Highlights / Activities */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900">Aktivitas & Daya Tarik Utama</h2>
            <div className="grid grid-cols-1 gap-2.5">
              {activeDestination.highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/70"
                >
                  <div className="w-7 h-7 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-slate-800">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Related Tour Packages */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">
                Paket Wisata di {activeDestination.name}
              </h2>
              <span className="text-xs text-slate-500">{relatedTours.length} paket</span>
            </div>

            <div className="space-y-3">
              {relatedTours.map((tour) => (
                <div
                  key={tour.id}
                  onClick={() => openTour(tour.id)}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200/70 shadow-sm cursor-pointer"
                >
                  <div className="relative h-40">
                    <ImageWithFallback
                      src={tour.images[0]}
                      alt={tour.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-teal-600 text-white text-[11px] font-semibold">
                      {tour.durationLabel}
                    </span>
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="font-bold text-sm text-slate-900">{tour.title}</h3>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div>
                        <span className="text-[11px] text-slate-400 block">Harga per orang</span>
                        <span className="text-sm font-bold text-teal-700">
                          {formatIDR(tour.pricePerPerson)}
                        </span>
                      </div>
                      <span className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold">
                        Pilih Paket
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  };

  // D. TOUR DETAIL PAGE
  const renderTourDetail = () => {
    return (
      <div className="pb-28 bg-[#F8F9FA] min-h-screen">
        {/* Gallery Hero */}
        <div className="relative h-80">
          <ImageWithFallback
            src={activeTour.images[0]}
            alt={activeTour.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-slate-950/30" />

          {/* Header Actions */}
          <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
            <button
              onClick={() => setCurrentPage('explore')}
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-900 shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => toggleWishlist(activeTour.id, e)}
                className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-sm"
              >
                <Heart
                  className={`w-4 h-4 ${
                    wishlist.includes(activeTour.id)
                      ? 'fill-rose-500 text-rose-500'
                      : 'text-slate-800'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Thumbnail Strip */}
          <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between">
            <div className="flex gap-2">
              {activeTour.images.map((img, i) => (
                <div
                  key={i}
                  className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white/80 shadow-md"
                >
                  <ImageWithFallback
                    src={img}
                    alt={`Galeri ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <span className="px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {activeTour.rating} ({activeTour.reviewsCount})
            </span>
          </div>
        </div>

        {/* Main Details */}
        <div className="px-5 pt-5 space-y-6">
          {/* Title & Location */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 text-[11px] font-bold">
                {activeTour.badge}
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-teal-600" />
                {activeTour.location}
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 leading-snug">
              {activeTour.title}
            </h1>
          </div>

          {/* Key Specs Card */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/70 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Durasi Perjalanan</span>
                <span className="text-xs font-bold text-slate-900">{activeTour.durationLabel}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
              <div className="w-9 h-9 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Titik Keberangkatan</span>
                <span className="text-xs font-bold text-slate-900">
                  {activeTour.departurePoint}
                </span>
              </div>
            </div>
          </div>

          {/* Available Schedules Preview */}
          <section className="space-y-2.5">
            <h2 className="text-sm font-bold text-slate-900">Jadwal Keberangkatan Tersedia</h2>
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {activeTour.availableDates.map((d) => (
                <div
                  key={d}
                  className="px-3.5 py-2 rounded-2xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shrink-0 flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5 text-teal-600" />
                  <span>{formatDateIndo(d)}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Description */}
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900">Deskripsi Paket</h2>
            <p className="text-xs text-slate-600 leading-relaxed">{activeTour.description}</p>
          </section>

          {/* Itinerary */}
          <section className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900">Rencana Perjalanan (Itinerary)</h2>
            <div className="bg-white p-4 rounded-3xl border border-slate-200/70 space-y-4">
              {activeTour.itinerary.map((item, idx) => (
                <div key={idx} className="relative pl-6 pb-1 last:pb-0">
                  {idx !== activeTour.itinerary.length - 1 && (
                    <div className="absolute left-[7px] top-4 bottom-0 w-0.5 bg-teal-100" />
                  )}
                  <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-teal-600 ring-4 ring-teal-50" />
                  <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">
                    {item.day}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 mt-0.5">{item.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Included & Excluded */}
          <section className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900">Fasilitas Paket</h2>
            <div className="bg-white p-4 rounded-3xl border border-slate-200/70 space-y-4">
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-emerald-700">Termasuk dalam Paket</h3>
                {activeTour.included.map((inc, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{inc}</span>
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <h3 className="text-xs font-bold text-rose-700">Tidak Termasuk</h3>
                {activeTour.excluded.map((exc, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-500">
                    <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>{exc}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Important Info */}
          <section className="space-y-2.5">
            <h2 className="text-sm font-bold text-slate-900">Informasi Penting</h2>
            <div className="bg-amber-50/80 border border-amber-200/80 p-4 rounded-3xl space-y-2">
              {activeTour.importantInfo.map((info, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-amber-950">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{info}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sticky Bottom CTA */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white/95 backdrop-blur-md border-t border-slate-200 px-5 py-3.5 z-30 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block">Harga per orang</span>
            <span className="text-lg font-bold text-teal-700">
              {formatIDR(activeTour.pricePerPerson)}
            </span>
          </div>
          <button
            onClick={() => startBooking(activeTour)}
            className="px-7 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold shadow-lg shadow-teal-600/25 transition"
          >
            Book Now
          </button>
        </div>
      </div>
    );
  };

  // E. BOOKING PAGE
  const renderBooking = () => {
    const handleContinueToPayment = (e) => {
      e.preventDefault();
      if (!bookingDraft.guestName.trim() || !bookingDraft.guestPhone.trim()) {
        showToast('Mohon lengkapi nama dan nomor telepon pemesan', 'error');
        return;
      }
      setCurrentPage('payment');
    };

    return (
      <div className="pb-32 bg-[#F8F9FA] min-h-screen">
        {/* Top App Bar */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-5 py-4 border-b border-slate-200/70 flex items-center gap-3">
          <button
            onClick={() => setCurrentPage('tour-detail')}
            className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-800"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-slate-900">Detail Pemesanan</h1>
            <p className="text-[11px] text-slate-500">Langkah 1 dari 2 • Lengkapi data</p>
          </div>
        </div>

        <form onSubmit={handleContinueToPayment} className="px-5 pt-5 space-y-5">
          {/* Selected Tour Mini Card */}
          <div className="flex gap-3 bg-white p-3.5 rounded-3xl border border-slate-200/70 shadow-sm">
            <ImageWithFallback
              src={bookingTour.images[0]}
              alt={bookingTour.title}
              className="w-20 h-20 rounded-2xl object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[11px] font-semibold text-teal-700">
                {bookingTour.location}
              </span>
              <h2 className="font-bold text-sm text-slate-900 line-clamp-2 mt-0.5">
                {bookingTour.title}
              </h2>
              <span className="text-xs text-slate-500 mt-1 block">
                {bookingTour.durationLabel}
              </span>
            </div>
          </div>

          {/* Select Date */}
          <section className="bg-white p-4 rounded-3xl border border-slate-200/70 space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-600" />
              <h3 className="text-sm font-bold text-slate-900">Pilih Tanggal Keberangkatan</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {bookingTour.availableDates.map((d) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => setBookingDraft((prev) => ({ ...prev, date: d }))}
                  className={`py-2.5 px-3 rounded-2xl text-xs font-semibold border text-left transition ${
                    bookingDraft.date === d
                      ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-teal-400'
                  }`}
                >
                  {formatDateIndo(d)}
                </button>
              ))}
            </div>
          </section>

          {/* Select Participants */}
          <section className="bg-white p-4 rounded-3xl border border-slate-200/70 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Jumlah Peserta</h3>
                <p className="text-xs text-slate-500">
                  {formatIDR(bookingTour.pricePerPerson)} / orang
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  setBookingDraft((prev) => ({
                    ...prev,
                    participants: Math.max(1, prev.participants - 1),
                  }))
                }
                className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 font-bold flex items-center justify-center hover:bg-slate-200"
              >
                -
              </button>
              <span className="w-6 text-center font-bold text-sm text-slate-900">
                {bookingDraft.participants}
              </span>
              <button
                type="button"
                onClick={() =>
                  setBookingDraft((prev) => ({
                    ...prev,
                    participants: Math.min(15, prev.participants + 1),
                  }))
                }
                className="w-9 h-9 rounded-xl bg-teal-600 text-white font-bold flex items-center justify-center hover:bg-teal-700"
              >
                +
              </button>
            </div>
          </section>

          {/* Add-ons */}
          <section className="bg-white p-4 rounded-3xl border border-slate-200/70 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Layanan Tambahan (Opsional)</h3>

            <label className="flex items-center justify-between p-3 rounded-2xl border border-slate-200/80 cursor-pointer">
              <div className="pr-3">
                <span className="text-xs font-bold text-slate-900 block">
                  Asuransi Perjalanan Wisata
                </span>
                <span className="text-[11px] text-slate-500">
                  Perlindungan medis & keterlambatan (+Rp 35.000/org)
                </span>
              </div>
              <input
                type="checkbox"
                checked={bookingDraft.includeInsurance}
                onChange={(e) =>
                  setBookingDraft((prev) => ({
                    ...prev,
                    includeInsurance: e.target.checked,
                  }))
                }
                className="w-5 h-5 accent-teal-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl border border-slate-200/80 cursor-pointer">
              <div className="pr-3">
                <span className="text-xs font-bold text-slate-900 block">
                  Antar-Jemput Bandara / Hotel Privat
                </span>
                <span className="text-[11px] text-slate-500">
                  Mobil privat PP ke titik kumpul (+Rp 150.000/grup)
                </span>
              </div>
              <input
                type="checkbox"
                checked={bookingDraft.includePickup}
                onChange={(e) =>
                  setBookingDraft((prev) => ({
                    ...prev,
                    includePickup: e.target.checked,
                  }))
                }
                className="w-5 h-5 accent-teal-600 rounded"
              />
            </label>
          </section>

          {/* Guest Information Form */}
          <section className="bg-white p-4 rounded-3xl border border-slate-200/70 space-y-3.5">
            <h3 className="text-sm font-bold text-slate-900">Data Pemesan</h3>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">Nama Lengkap</label>
              <input
                type="text"
                required
                value={bookingDraft.guestName}
                onChange={(e) =>
                  setBookingDraft((prev) => ({ ...prev, guestName: e.target.value }))
                }
                placeholder="Sesuai KTP / Paspor"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-teal-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">Nomor WhatsApp</label>
              <input
                type="tel"
                required
                value={bookingDraft.guestPhone}
                onChange={(e) =>
                  setBookingDraft((prev) => ({ ...prev, guestPhone: e.target.value }))
                }
                placeholder="Contoh: 081234567890"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-teal-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">Email (Untuk E-Voucher)</label>
              <input
                type="email"
                required
                value={bookingDraft.guestEmail}
                onChange={(e) =>
                  setBookingDraft((prev) => ({ ...prev, guestEmail: e.target.value }))
                }
                placeholder="nama@email.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-teal-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">
                Catatan Khusus (Opsional)
              </label>
              <textarea
                rows={2}
                value={bookingDraft.specialNotes}
                onChange={(e) =>
                  setBookingDraft((prev) => ({ ...prev, specialNotes: e.target.value }))
                }
                placeholder="Alergi makanan, permintaan khusus, dll."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-teal-600"
              />
            </div>
          </section>

          {/* Price Breakdown */}
          <section className="bg-white p-4 rounded-3xl border border-slate-200/70 space-y-2.5">
            <h3 className="text-sm font-bold text-slate-900">Rincian Harga</h3>
            <div className="flex justify-between text-xs text-slate-600">
              <span>
                Paket Wisata ({bookingDraft.participants}x {formatIDR(bookingTour.pricePerPerson)})
              </span>
              <span className="font-semibold text-slate-900">{formatIDR(priceBreakdown.base)}</span>
            </div>
            {bookingDraft.includeInsurance && (
              <div className="flex justify-between text-xs text-slate-600">
                <span>Asuransi Perjalanan ({bookingDraft.participants}x)</span>
                <span className="font-semibold text-slate-900">
                  {formatIDR(priceBreakdown.insurance)}
                </span>
              </div>
            )}
            {bookingDraft.includePickup && (
              <div className="flex justify-between text-xs text-slate-600">
                <span>Antar-Jemput Privat</span>
                <span className="font-semibold text-slate-900">
                  {formatIDR(priceBreakdown.pickup)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-xs text-slate-600">
              <span>Biaya Layanan Platform</span>
              <span className="font-semibold text-slate-900">
                {formatIDR(priceBreakdown.serviceFee)}
              </span>
            </div>
            <div className="pt-2.5 border-t border-slate-100 flex justify-between items-center">
              <span className="text-sm font-bold text-slate-900">Total Pembayaran</span>
              <span className="text-base font-bold text-teal-700">
                {formatIDR(priceBreakdown.total)}
              </span>
            </div>
          </section>

          {/* Sticky Bottom CTA */}
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white/95 backdrop-blur-md border-t border-slate-200 px-5 py-3.5 z-30 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block">Total Tagihan</span>
              <span className="text-lg font-bold text-slate-900">
                {formatIDR(priceBreakdown.total)}
              </span>
            </div>
            <button
              type="submit"
              className="px-7 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold shadow-lg shadow-teal-600/25 transition"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    );
  };

  // F. PAYMENT PAGE
  const renderPayment = () => {
    const activeMethod =
      PAYMENT_METHODS.find((m) => m.id === selectedPaymentMethod) || PAYMENT_METHODS[0];
    const grandTotal = priceBreakdown.total + activeMethod.fee;

    const handlePayNow = (simulateSuccess = true) => {
      setIsProcessingPayment(true);
      setPaymentResult(null);

      setTimeout(() => {
        setIsProcessingPayment(false);
        if (!simulateSuccess) {
          setPaymentResult('failed');
          showToast('Simulasi pembayaran gagal. Silakan coba lagi.', 'error');
          return;
        }

        const newBooking = {
          id: generateBookingRef(),
          tourId: bookingTour.id,
          tourTitle: bookingTour.title,
          tourLocation: bookingTour.location,
          tourImage: bookingTour.images[0],
          date: bookingDraft.date,
          participants: bookingDraft.participants,
          guestName: bookingDraft.guestName,
          guestEmail: bookingDraft.guestEmail,
          guestPhone: bookingDraft.guestPhone,
          totalAmount: grandTotal,
          paymentMethod: activeMethod.name,
          status: 'UPCOMING',
          createdAt: new Date().toISOString().split('T')[0],
        };

        setBookings((prev) => [newBooking, ...prev]);
        setLatestBooking(newBooking);
        setPaymentResult('success');
        setCurrentPage('confirmation');
      }, 1400);
    };

    return (
      <div className="pb-32 bg-[#F8F9FA] min-h-screen">
        {/* Top App Bar */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-5 py-4 border-b border-slate-200/70 flex items-center gap-3">
          <button
            onClick={() => setCurrentPage('booking')}
            disabled={isProcessingPayment}
            className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-800"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-slate-900">Pembayaran</h1>
            <p className="text-[11px] text-slate-500">Langkah 2 dari 2 • Simulasi Pembayaran</p>
          </div>
        </div>

        <div className="px-5 pt-5 space-y-5">
          {/* Payment Failed Banner if triggered */}
          {paymentResult === 'failed' && (
            <div className="p-4 rounded-3xl bg-rose-50 border border-rose-200 flex items-start gap-3">
              <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-rose-900">Pembayaran Tidak Berhasil</h3>
                <p className="text-xs text-rose-700 leading-relaxed">
                  Transaksi simulasi ditolak oleh penyedia pembayaran. Silakan pilih metode lain
                  atau klik Pay Now kembali.
                </p>
              </div>
            </div>
          )}

          {/* Order Summary Card */}
          <section className="bg-white p-4 rounded-3xl border border-slate-200/70 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Ringkasan Pesanan
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                Menunggu Pembayaran
              </span>
            </div>
            <h2 className="font-bold text-sm text-slate-900">{bookingTour.title}</h2>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Jadwal</span>
                <span className="font-semibold text-slate-800">
                  {formatDateIndo(bookingDraft.date)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Peserta</span>
                <span className="font-semibold text-slate-800">
                  {bookingDraft.participants} Orang
                </span>
              </div>
              <div className="col-span-2 pt-1">
                <span className="text-slate-400 block text-[11px]">Pemesan</span>
                <span className="font-semibold text-slate-800">
                  {bookingDraft.guestName} ({bookingDraft.guestPhone})
                </span>
              </div>
            </div>
          </section>

          {/* Payment Methods */}
          <section className="space-y-2.5">
            <h3 className="text-sm font-bold text-slate-900">Pilih Metode Pembayaran</h3>
            <div className="space-y-2.5">
              {PAYMENT_METHODS.map((method) => {
                const Icon = method.icon;
                const isSelected = selectedPaymentMethod === method.id;
                return (
                  <div
                    key={method.id}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                    className={`flex items-center justify-between p-4 rounded-3xl border bg-white cursor-pointer transition ${
                      isSelected
                        ? 'border-teal-600 ring-2 ring-teal-600/15'
                        : 'border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                          isSelected
                            ? 'bg-teal-600 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{method.name}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">{method.subtitle}</p>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-teal-600' : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-teal-600" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Final Total Card */}
          <section className="bg-white p-4 rounded-3xl border border-slate-200/70 space-y-2">
            <div className="flex justify-between text-xs text-slate-600">
              <span>Subtotal Paket & Tambahan</span>
              <span className="font-semibold text-slate-900">
                {formatIDR(priceBreakdown.total)}
              </span>
            </div>
            <div className="flex justify-between text-xs text-slate-600">
              <span>Biaya Admin ({activeMethod.name})</span>
              <span className="font-semibold text-slate-900">
                {activeMethod.fee === 0 ? 'Gratis' : formatIDR(activeMethod.fee)}
              </span>
            </div>
            <div className="pt-2.5 border-t border-slate-100 flex justify-between items-center">
              <span className="text-sm font-bold text-slate-900">Total Dibayar</span>
              <span className="text-lg font-bold text-teal-700">{formatIDR(grandTotal)}</span>
            </div>
          </section>

          {/* Security Note & Fail Test Button */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Transaksi aman & terenkripsi</span>
            </div>
            <button
              type="button"
              disabled={isProcessingPayment}
              onClick={() => handlePayNow(false)}
              className="text-[11px] font-semibold text-rose-600 hover:underline"
            >
              Simulasi Gagal
            </button>
          </div>
        </div>

        {/* Sticky Bottom CTA */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white/95 backdrop-blur-md border-t border-slate-200 px-5 py-3.5 z-30">
          <button
            type="button"
            disabled={isProcessingPayment}
            onClick={() => handlePayNow(true)}
            className="w-full py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 disabled:bg-slate-400 text-white text-sm font-bold shadow-lg shadow-teal-600/25 flex items-center justify-center gap-2 transition"
          >
            {isProcessingPayment ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Memproses Pembayaran...</span>
              </>
            ) : (
              <span>Pay Now • {formatIDR(grandTotal)}</span>
            )}
          </button>
        </div>
      </div>
    );
  };

  // G. BOOKING CONFIRMATION PAGE
  const renderConfirmation = () => {
    const booking = latestBooking || bookings[0];
    if (!booking) return null;

    return (
      <div className="min-h-screen bg-[#F8F9FA] px-5 py-8 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Success Hero */}
          <div className="text-center space-y-2.5 pt-2">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Pemesanan Berhasil!</h1>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
              E-Voucher perjalanan telah diterbitkan dan tersimpan di menu{' '}
              <span className="font-semibold text-slate-800">My Trips</span>.
            </p>
          </div>

          {/* E-Ticket Card */}
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-md">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-slate-400 block">
                  Booking Reference
                </span>
                <span className="text-lg font-mono font-bold tracking-wider text-teal-400">
                  {booking.id}
                </span>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                LUNAS
              </span>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <span className="text-[11px] text-slate-400 block">Paket Perjalanan</span>
                <h2 className="font-bold text-sm text-slate-900 mt-0.5">{booking.tourTitle}</h2>
                <span className="text-xs text-teal-700 font-medium">{booking.tourLocation}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-dashed border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Jadwal Perjalanan</span>
                  <span className="font-bold text-slate-900">{formatDateIndo(booking.date)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Jumlah Peserta</span>
                  <span className="font-bold text-slate-900">{booking.participants} Orang</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Nama Pemesan</span>
                  <span className="font-bold text-slate-900">{booking.guestName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Metode Bayar</span>
                  <span className="font-bold text-slate-900">{booking.paymentMethod}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">Total Pembayaran</span>
                <span className="text-base font-bold text-teal-700">
                  {formatIDR(booking.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-6">
          <button
            onClick={() => setCurrentPage('my-trips')}
            className="w-full py-3.5 rounded-2xl bg-slate-900 text-white text-sm font-bold shadow-sm"
          >
            Lihat di My Trips
          </button>
          <button
            onClick={() => setCurrentPage('home')}
            className="w-full py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-800 text-sm font-bold"
          >
            Kembali ke Home
          </button>
        </div>
      </div>
    );
  };

  // H. MY TRIPS PAGE
  const renderMyTrips = () => {
    const [tripTab, setTripTab] = useState('UPCOMING'); // 'UPCOMING' | 'COMPLETED'

    const upcomingBookings = bookings.filter((b) => b.status === 'UPCOMING');
    const completedBookings = bookings.filter((b) => b.status === 'COMPLETED');
    const displayedList = tripTab === 'UPCOMING' ? upcomingBookings : completedBookings;

    const markAsCompleted = (bookingId) => {
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: 'COMPLETED' } : b))
      );
      showToast('Status perjalanan diperbarui menjadi Selesai');
    };

    return (
      <div className="pb-28 min-h-screen px-5 pt-5 space-y-5">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Perjalanan Saya</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola jadwal liburan dan e-voucher kamu
          </p>
        </div>

        {/* Segmented Control */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-200/70">
          <button
            onClick={() => setTripTab('UPCOMING')}
            className={`py-2.5 rounded-xl text-xs font-bold transition ${
              tripTab === 'UPCOMING'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600'
            }`}
          >
            Akan Datang ({upcomingBookings.length})
          </button>
          <button
            onClick={() => setTripTab('COMPLETED')}
            className={`py-2.5 rounded-xl text-xs font-bold transition ${
              tripTab === 'COMPLETED'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600'
            }`}
          >
            Selesai ({completedBookings.length})
          </button>
        </div>

        {/* Booking Cards */}
        {displayedList.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200/70 space-y-3 mt-4">
            <div className="w-14 h-14 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
              <Briefcase className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">
              {tripTab === 'UPCOMING'
                ? 'Belum ada perjalanan terjadwal'
                : 'Belum ada riwayat perjalanan selesai'}
            </h3>
            <p className="text-xs text-slate-500">
              Temukan paket wisata impianmu ke berbagai destinasi indah di Indonesia.
            </p>
            <button
              onClick={() => setCurrentPage('explore')}
              className="px-5 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold"
            >
              Jelajahi Paket Wisata
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedList.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/70 shadow-sm"
              >
                <div className="p-4 flex gap-3.5">
                  <ImageWithFallback
                    src={item.tourImage}
                    alt={item.tourTitle}
                    className="w-20 h-20 rounded-2xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-mono font-bold text-slate-500">
                        {item.id}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === 'UPCOMING'
                            ? 'bg-teal-50 text-teal-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.status === 'UPCOMING' ? 'Terkonfirmasi' : 'Selesai'}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 line-clamp-2 mt-1 leading-snug">
                      {item.tourTitle}
                    </h3>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-teal-600" />
                        {formatDateIndo(item.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-teal-600" />
                        {item.participants} Org
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Total Dibayar</span>
                    <span className="text-xs font-bold text-slate-900">
                      {formatIDR(item.totalAmount)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.status === 'UPCOMING' && (
                      <button
                        onClick={() => markAsCompleted(item.id)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-[11px] font-semibold text-slate-700 hover:bg-slate-100"
                      >
                        Selesaikan Tur
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setLatestBooking(item);
                        setCurrentPage('confirmation');
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-teal-600 text-white text-[11px] font-semibold"
                    >
                      E-Voucher
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // I. PROFILE PAGE
  const renderProfile = () => {
    return (
      <div className="pb-28 min-h-screen px-5 pt-6 space-y-6">
        {/* User Profile Card */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/70 shadow-sm flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-emerald-700 text-white flex items-center justify-center text-xl font-bold shrink-0">
            RP
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-900 truncate">Raka Pratama</h1>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center gap-0.5">
                <Award className="w-3 h-3" /> Explorer
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
              <Mail className="w-3 h-3" /> raka.pratama@email.id
            </p>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
              <Phone className="w-3 h-3" /> +62 812-3456-7890
            </p>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-3">
          <div
            onClick={() => setCurrentPage('my-trips')}
            className="bg-white p-3.5 rounded-2xl border border-slate-200/70 text-center cursor-pointer"
          >
            <span className="text-lg font-bold text-teal-700 block">{bookings.length}</span>
            <span className="text-[11px] text-slate-500">Total Trip</span>
          </div>
          <div
            onClick={() => setCurrentPage('explore')}
            className="bg-white p-3.5 rounded-2xl border border-slate-200/70 text-center cursor-pointer"
          >
            <span className="text-lg font-bold text-slate-900 block">{wishlist.length}</span>
            <span className="text-[11px] text-slate-500">Disimpan</span>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/70 text-center">
            <span className="text-lg font-bold text-amber-600 block">450</span>
            <span className="text-[11px] text-slate-500">Poin Travel</span>
          </div>
        </div>

        {/* Menu List */}
        <div className="bg-white rounded-3xl border border-slate-200/70 divide-y divide-slate-100 overflow-hidden">
          <button
            onClick={() => setCurrentPage('my-trips')}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">Riwayat Pemesanan</span>
                <span className="text-[11px] text-slate-500">
                  Lihat semua transaksi & e-voucher
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => showToast('Layanan pelanggan aktif 24/7 via WhatsApp')}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">Pusat Bantuan</span>
                <span className="text-[11px] text-slate-500">
                  FAQ, perubahan jadwal & pembatalan
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => showToast('Nusantara Wanderlust v1.0 • Storefront Edition')}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">Tentang Aplikasi</span>
                <span className="text-[11px] text-slate-500">
                  Syarat ketentuan & kebijakan privasi
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Guest Mode Badge */}
        <div className="p-4 rounded-2xl bg-slate-200/60 text-center">
          <p className="text-[11px] text-slate-500">
            Mode Tamu Aktif • Tidak memerlukan kata sandi untuk melakukan pemesanan.
          </p>
        </div>
      </div>
    );
  };

  // ============================================================================
  // BOTTOM NAVIGATION BAR (4 MAIN TABS)
  // ============================================================================
  const showBottomNav = ['home', 'explore', 'my-trips', 'profile'].includes(currentPage);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'my-trips', label: 'My Trips', icon: Briefcase },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex justify-center font-sans antialiased selection:bg-teal-600 selection:text-white">
      {/* Custom Utility Styles for Scrollbar Hiding & Smooth Animations */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up { animation: slideUp 0.25s ease-out; }
      `}</style>

      {/* Mobile App Viewport Frame */}
      <div className="w-full max-w-[430px] bg-[#F8F9FA] min-h-screen relative shadow-2xl overflow-x-hidden">
        <ToastNotification toast={toast} onClose={() => setToast(null)} />

        {/* Dynamic Page View */}
        {currentPage === 'home' && renderHome()}
        {currentPage === 'explore' && renderExplore()}
        {currentPage === 'destination-detail' && renderDestinationDetail()}
        {currentPage === 'tour-detail' && renderTourDetail()}
        {currentPage === 'booking' && renderBooking()}
        {currentPage === 'payment' && renderPayment()}
        {currentPage === 'confirmation' && renderConfirmation()}
        {currentPage === 'my-trips' && renderMyTrips()}
        {currentPage === 'profile' && renderProfile()}

        {/* Bottom Navigation */}
        {showBottomNav && (
          <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-4 py-2.5 z-40">
            <div className="grid grid-cols-4 gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className={`flex flex-col items-center justify-center py-1.5 rounded-2xl transition ${
                      isActive
                        ? 'text-teal-700 bg-teal-50/80'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 mb-1 ${
                        isActive ? 'stroke-[2.4px] text-teal-600' : 'stroke-[1.8px]'
                      }`}
                    />
                    <span
                      className={`text-[11px] ${
                        isActive ? 'font-bold text-teal-700' : 'font-medium'
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </div>
  );
}
```