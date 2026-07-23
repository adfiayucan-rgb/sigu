/** Parse "HH:MM" → minutes from midnight */
export function parseMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/** Format minutes-from-midnight → "HH:MM" */
export function formatTime(minutes: number): string {
  const clamped = Math.max(0, Math.min(23 * 60 + 59, minutes));
  const h = Math.floor(clamped / 60);
  const m = clamped % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Add (or subtract) minutes to a "HH:MM" string, snapped to a grid */
export function addMinutesToTime(time: string, deltaMinutes: number, snapMins = 15): string {
  const total = parseMinutes(time) + deltaMinutes;
  const snapped = Math.round(total / snapMins) * snapMins;
  return formatTime(snapped);
}

/** Convert a pixel delta-Y into a minute delta (snapped) */
export function deltaYToMinutes(deltaY: number, snapMins = 15): number {
  const raw = (deltaY / SLOT_HEIGHT) * 60;
  return Math.round(raw / snapMins) * snapMins;
}

/** Pixel height per 60-minute slot */
export const SLOT_HEIGHT = 64; // px per hour
export const DAY_START_HOUR = 7; // 07:00
export const DAY_END_HOUR = 21;  // 21:00

/** Top offset (px) for a given HH:MM time */
export function timeToTop(time: string): number {
  const mins = parseMinutes(time) - DAY_START_HOUR * 60;
  return (mins / 60) * SLOT_HEIGHT;
}

/** Height (px) for a start→end span */
export function durationToHeight(start: string, end: string): number {
  const mins = parseMinutes(end) - parseMinutes(start);
  return Math.max((mins / 60) * SLOT_HEIGHT, 24);
}

export const HOURS = Array.from(
  { length: DAY_END_HOUR - DAY_START_HOUR },
  (_, i) => DAY_START_HOUR + i,
);
