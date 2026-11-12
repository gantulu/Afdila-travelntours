export function formatDateReadable(isoDate: string): string {
  if (!isoDate) return '-';
  const parts = isoDate.split('-');
  if (parts.length !== 3) return isoDate;
  const dateObj = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  if (isNaN(dateObj.getTime())) return isoDate;
  return dateObj.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export function calculateReturnDate(departureIso: string, durationDays: number): string {
  if (!departureIso) return '-';
  const parts = departureIso.split('-');
  if (parts.length !== 3) return '-';
  const dateObj = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  if (isNaN(dateObj.getTime())) return '-';
  dateObj.setDate(dateObj.getDate() + Math.max(0, durationDays - 1));
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return formatDateReadable(`${y}-${m}-${d}`);
}
