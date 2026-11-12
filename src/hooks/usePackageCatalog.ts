import { useMemo } from 'react';
import { PACKAGES_DATA } from '../data/packages';
import type { TravelPackage } from '../types/travel.types';

export type PriceFilter = 'all' | 'under5m' | '5mto15m' | 'above15m';
export type PackageSort = 'recommended' | 'price_asc' | 'price_desc' | 'rating_desc';

interface UsePackageCatalogOptions {
  searchQuery: string;
  selectedCategory: string;
  selectedDestinationFilter: string;
  priceFilter: PriceFilter;
  durationFilter: 'all' | '1to3' | '4to5' | '6plus';
  sortBy: PackageSort;
}

interface UsePackageCatalogResult {
  filteredPackages: TravelPackage[];
  activeFilterCount: number;
}

export function usePackageCatalog({
  searchQuery,
  selectedCategory,
  selectedDestinationFilter,
  priceFilter,
  durationFilter,
  sortBy
}: UsePackageCatalogOptions): UsePackageCatalogResult {
  const filteredPackages = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const matchingPackages = PACKAGES_DATA.filter((pkg) => {
      if (query) {
        const matchesSearch =
          pkg.name.toLowerCase().includes(query) ||
          pkg.destination.toLowerCase().includes(query) ||
          pkg.category.toLowerCase().includes(query) ||
          pkg.description.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      if (selectedCategory !== 'All' && pkg.category !== selectedCategory) return false;
      if (selectedDestinationFilter !== 'All' && pkg.destinationId !== selectedDestinationFilter) return false;

      const effectivePrice = pkg.discountPrice ?? pkg.price;
      if (priceFilter === 'under5m' && effectivePrice >= 5000000) return false;
      if (priceFilter === '5mto15m' && (effectivePrice < 5000000 || effectivePrice > 15000000)) return false;
      if (priceFilter === 'above15m' && effectivePrice <= 15000000) return false;

      if (durationFilter === '1to3' && pkg.durationDays > 3) return false;
      if (durationFilter === '4to5' && (pkg.durationDays < 4 || pkg.durationDays > 5)) return false;
      if (durationFilter === '6plus' && pkg.durationDays < 6) return false;

      return true;
    });

    return [...matchingPackages].sort((a, b) => {
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
    if (selectedCategory !== 'All') count += 1;
    if (selectedDestinationFilter !== 'All') count += 1;
    if (priceFilter !== 'all') count += 1;
    if (durationFilter !== 'all') count += 1;
    return count;
  }, [selectedCategory, selectedDestinationFilter, priceFilter, durationFilter]);

  return { filteredPackages, activeFilterCount };
}
