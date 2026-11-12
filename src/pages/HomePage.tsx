import React from 'react';
import { Search, X, Sparkles, Star } from 'lucide-react';
import { TRAVEL_CATEGORIES } from '../data/travel-categories';
import { DESTINATIONS_DATA } from '../data/destinations';
import { PACKAGES_DATA } from '../data/packages';
import { PackageCard } from '../components/PackageCard';
import type { MainTab, StandaloneView } from '../types/navigation.types';

interface HomePageProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  setActiveTab: (tab: MainTab) => void;
  setSelectedCategory: (category: string) => void;
  setStandalone: (view: StandaloneView) => void;
  openDestinationDetail: (destinationId: string) => void;
  openPackageDetail: (packageId: string) => void;
  wishlistIds: string[];
  toggleWishlist: (packageId: string) => void;
}

export function HomePage({ searchQuery, setSearchQuery, setActiveTab, setSelectedCategory, setStandalone, openDestinationDetail, openPackageDetail, wishlistIds, toggleWishlist }: HomePageProps) {
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
  }