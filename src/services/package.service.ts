import { PACKAGES_DATA } from '../data/packages';
import type { TravelPackage } from '../types/travel.types';

export function getPackageById(packageId: string): TravelPackage | undefined {
  return PACKAGES_DATA.find((pkg) => pkg.id === packageId);
}

export function getPackagesByDestination(destinationId: string): TravelPackage[] {
  return PACKAGES_DATA.filter((pkg) => pkg.destinationId === destinationId);
}
