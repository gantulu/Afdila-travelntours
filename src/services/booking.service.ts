import type { Traveler } from '../types/booking.types';

export function reconcileTravelers(
  existing: Traveler[],
  adults: number,
  children: number,
  infants: number
): Traveler[] {
  const desiredTypes: Traveler['type'][] = [
    ...Array(adults).fill('Adult'),
    ...Array(children).fill('Child'),
    ...Array(infants).fill('Infant')
  ];
  return desiredTypes.map((type, index) => {
    const previous = existing[index];
    if (previous) return { ...previous, type };
    return {
      id: `trav-${index + 1}-${Math.random().toString(36).slice(2, 7)}`,
      type, fullName: '', dateOfBirth: '', gender: '',
      identityNumber: '', specialRequirements: ''
    };
  });
}
