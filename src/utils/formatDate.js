const MONTHS = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC',
];

// Splits an ISO date string into the three lines shown on the journey date card.
// "2025-06-27T08:30:00" -> { month: 'JUN', day: '27', time: '8:30AM' }
export function formatJourneyDate(iso) {
  const date = new Date(iso);
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return {
    month: MONTHS[date.getMonth()],
    day: String(date.getDate()),
    time: `${hour12}:${minutes}${suffix}`,
  };
}
