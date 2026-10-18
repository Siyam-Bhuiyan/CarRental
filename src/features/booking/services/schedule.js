// "When" choices offered when planning a ride. Each resolves to a concrete date.
const at = (date, hours, minutes = 0) => {
  const d = new Date(date);
  d.setHours(hours, minutes, 0, 0);
  return d;
};

export function whenOptions(now = new Date()) {
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const inHour = new Date(now.getTime() + 60 * 60 * 1000);
  return [
    { id: 'now', label: 'Now', date: now.toISOString() },
    { id: '1h', label: 'In 1 hour', date: inHour.toISOString() },
    { id: 'tom9', label: 'Tomorrow 9:00 AM', date: at(tomorrow, 9).toISOString() },
    { id: 'tom18', label: 'Tomorrow 6:00 PM', date: at(tomorrow, 18).toISOString() },
  ];
}

export const defaultWhen = () => whenOptions()[0];
