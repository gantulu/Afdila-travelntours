export type MainTab = 'home' | 'explore' | 'wishlist' | 'bookings' | 'profile';

export type StandaloneView =
  | null
  | { type: 'destination'; destinationId: string }
  | { type: 'package'; packageId: string }
  | { type: 'booking'; packageId: string }
  | { type: 'checkout' }
  | { type: 'confirmation'; bookingReference: string }
  | { type: 'bookingDetail'; bookingReference: string }
  | { type: 'infoPage'; page: 'about' | 'contact' | 'help' | 'terms' | 'privacy' };
