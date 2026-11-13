import { DESTINATIONS_DATA } from '../data/destinations';
import type { DestinationInfo } from '../types/travel.types';

export function getDestinationById(destinationId: string): DestinationInfo | undefined {
  return DESTINATIONS_DATA.find((destination) => destination.id === destinationId);
}

export function getOtherDestinations(destinationId: string): DestinationInfo[] {
  return DESTINATIONS_DATA.filter((destination) => destination.id !== destinationId);
}
