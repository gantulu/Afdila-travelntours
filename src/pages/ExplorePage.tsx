import React from 'react';
import { Search, X, SlidersHorizontal, ChevronRight, ArrowUpDown, Compass } from 'lucide-react';
import { DESTINATIONS_DATA } from '../data/destinations';
import { TRAVEL_CATEGORIES } from '../data/travel-categories';
import { EmptyState } from '../components/ui/FeedbackComponents';
import { PackageCard } from '../components/PackageCard';
import type { PriceFilter, PackageSort } from '../hooks/usePackageCatalog';

interface ExplorePageProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  setFilterSheetOpen: (open: boolean) => void;
  activeFilterCount: number;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedDestinationFilter: string;
  setSelectedDestinationFilter: (destinationId: string) => void;
  filteredPackages: import('../types/travel.types').TravelPackage[];
  sortBy: PackageSort;
  setSortBy: (sort: PackageSort) => void;
  setPriceFilter: (filter: PriceFilter) => void;
  setDurationFilter: (filter: 'all' | '1to3' | '4to5' | '6plus') => void;
  openDestinationDetail: (destinationId: string) => void;
  openPackageDetail: (packageId: string) => void;
  wishlistIds: string[];
  toggleWishlist: (packageId: string) => void;
}

export function ExplorePage({ searchQuery, setSearchQuery, setFilterSheetOpen, activeFilterCount, selectedCategory, setSelectedCategory, selectedDestinationFilter, setSelectedDestinationFilter, filteredPackages, sortBy, setSortBy, setPriceFilter, setDurationFilter, openDestinationDetail, openPackageDetail, wishlistIds, toggleWishlist }: ExplorePageProps) {
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
  }