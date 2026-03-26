import { DateTime } from 'luxon';

function parseDate(dateValue: string): DateTime {
  let parsed = DateTime.fromISO(dateValue);
  if (parsed.isValid) return parsed;

  parsed = DateTime.fromSQL(dateValue);
  if (parsed.isValid) return parsed;

  parsed = DateTime.fromFormat(dateValue, 'yyyy-MM-dd HH:mm:ss');
  if (parsed.isValid) return parsed;

  return DateTime.invalid('Formato de fecha no soportado');
}

export function formatDateTime(value: string | null | undefined, fallback: string = '-'): string {
  if (!value || value === 'null' || value === '') return fallback;
  const parsed = parseDate(value);
  if (!parsed.isValid) return value.length > 20 ? value.substring(0, 20) : value;
  return parsed.toLocaleString(DateTime.DATETIME_SHORT);
}

export function getHumanDuration(entryTime: string, exitTime: string | null): string {
  const entry = parseDate(entryTime);
  if (!entry.isValid) return '0 minutos';

  const exit = exitTime ? parseDate(exitTime) : DateTime.now();
  if (!exit.isValid) return '0 minutos';

  const totalMinutes = Math.round(exit.diff(entry, 'minutes').minutes);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
  if (minutes === 0) return `${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  return `${hours} ${hours === 1 ? 'hora' : 'horas'} ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
}
