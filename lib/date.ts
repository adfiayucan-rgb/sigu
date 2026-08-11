import {
  addDays,
  endOfDay,
  startOfDay,
  subDays,
} from "date-fns";

export const APP_TIME_ZONE = "America/Bogota";

const WEEK_DAYS: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

function getDateTimeParts(date: Date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: APP_TIME_ZONE,
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date);

  return Object.fromEntries(
    parts.map(({ type, value }) => [type, value]),
  );
}

export function getNow() {
  return new Date();
}

export function getCurrentDateTime() {
  const parts = getDateTimeParts();

  return {
    year: Number(parts.year),
    month: Number(parts.month),
    dayOfMonth: Number(parts.day),
    day: WEEK_DAYS[parts.weekday],
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    second: Number(parts.second),
    date: `${parts.year}-${parts.month}-${parts.day}`,
    time: `${parts.hour}:${parts.minute}:${parts.second}`,
  };
}

export function getCurrentDay() {
  return getCurrentDateTime().day;
}

export function getCurrentTime() {
  return getCurrentDateTime().time;
}

export function getCurrentDate() {
  return getCurrentDateTime().date;
}

export function getToday() {
  return startOfDay(new Date());
}

export function getYesterday() {
  return subDays(getToday(), 1);
}

export function getTomorrow() {
  return addDays(getToday(), 1);
}

export function getStartOfToday() {
  return startOfDay(new Date());
}

export function getEndOfToday() {
  return endOfDay(new Date());
}

export function getDayOfWeek(date: Date = new Date()) {
  const parts = getDateTimeParts(date);
  return WEEK_DAYS[parts.weekday];
}

export function getTime(date: Date = new Date()) {
  const parts = getDateTimeParts(date);

  return `${parts.hour}:${parts.minute}:${parts.second}`;
}

export function getDateOnly(date: Date = new Date()) {
  const parts = getDateTimeParts(date);

  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function isToday(date: Date) {
  return getDateOnly(date) === getCurrentDate();
}