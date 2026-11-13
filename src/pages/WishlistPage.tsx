import React from 'react';
import { Heart } from 'lucide-react';
import { PACKAGES_DATA } from '../data/packages';
import { Badge, EmptyState } from '../components/ui/FeedbackComponents';
import { PackageCard } from '../components/PackageCard';

interface WishlistPageProps {
  wishlistIds: string[];
  setActiveTab: (tab: 'home' | 'explore' | 'wishlist' | 'bookings' | 'profile') => void;
  openPackageDetail: (packageId: string) => void;
  toggleWishlist: (packageId: string) => void;
}

export function WishlistPage({ wishlistIds, setActiveTab, openPackageDetail, toggleWishlist }: WishlistPageProps) {
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
  }