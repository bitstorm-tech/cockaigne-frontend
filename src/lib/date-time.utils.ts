import { addMinutes, format, parseISO } from "date-fns";
import formatInTimeZone from "date-fns-tz/formatInTimeZone";
import type { Deal } from "./supabase/public-types";

const DATE_FORMAT = "yyyy-MM-dd";
const DATE_TIME_FORMAT_WITHOUT_TIMEZONE = DATE_FORMAT + "'T'HH:mm";
const DATE_TIME_FORMAT_WITH_TIMEZONE = DATE_TIME_FORMAT_WITHOUT_TIMEZONE + "XXX";

export const MONTH_MAPPING = [
  "", // placeholder so we can begin with 1 as month not 0
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember"
];

export function getDateTimeStringWithoutTimezone(
  date = new Date(),
  offsetInMinutes = 0,
  timezone = "Europe/Berlin"
): string {
  const dateWithOffset = addMinutes(date, offsetInMinutes);
  return formatInTimeZone(dateWithOffset, timezone, DATE_TIME_FORMAT_WITHOUT_TIMEZONE);
}

export function getDateStringWithoutTimezone(
  date = new Date(),
  offsetInMinutes = 0,
  timezone = "Europe/Berlin"
): string {
  const dateWithOffset = addMinutes(date, offsetInMinutes);
  return formatInTimeZone(dateWithOffset, timezone, DATE_FORMAT);
}

export function formatDate(date: string | number, offsetInMinutes = 0, timezone = "Europe/Berlin"): string {
  const dateWithOffset = addMinutes(new Date(date), offsetInMinutes);
  return formatInTimeZone(dateWithOffset, timezone, "dd.MM.yyyy 'um' HH:mm");
}

function addTimezoneOffset(datetime: string): string {
  const date = new Date(datetime);
  const offsetInMinutes = date.getTimezoneOffset();
  const offsetInHours = Math.floor(Math.abs(offsetInMinutes) / 60);
  const offsetInMinutesRemainder = Math.abs(offsetInMinutes) % 60;

  return format(
    date,
    `${DATE_TIME_FORMAT_WITHOUT_TIMEZONE}${offsetInMinutes < 0 ? "+" : "-"}${offsetInHours
      .toString()
      .padStart(2, "0")}:${offsetInMinutesRemainder.toString().padStart(2, "0")}`
  );
}

function removeTimezoneOffset(datetime: string): string {
  const date = parseISO(datetime);
  return format(date, DATE_TIME_FORMAT_WITHOUT_TIMEZONE);
}

export function addTimezoneOffsetToDeal(deal: Deal) {
  deal.start = addTimezoneOffset(deal.start);
}

export function removeTimezoneOffsetFromDeal(deal: Deal) {
  deal.start = removeTimezoneOffset(deal.start);
}

export function getTimeString(datetime: string | Date = new Date(), timezone = "Europe/Berlin"): string {
  return formatInTimeZone(new Date(datetime), timezone, "HH:mm:ss");
}

export function formatDateWithTimeZone(date: Date | string): string {
  return formatInTimeZone(date, "Europe/Berlin", DATE_TIME_FORMAT_WITH_TIMEZONE);
}

export function isBeforeNow(dateTime: string): boolean {
  const date = parseISO(dateTime);
  const now = new Date();
  return date < now;
}

export type DateRangeSlice = {
  year: number;
  month: number;
};

export function generateDateRange(start: Date, end = new Date()): DateRangeSlice[] {
  const startYear = start.getFullYear();
  const startMonth = start.getMonth() + 1;
  const endYear = end.getFullYear();
  const endMonth = end.getMonth() + 1;
  const dateRange: DateRangeSlice[] = [];

  for (let year = startYear; year <= endYear; year++) {
    let monthFrom = year === startYear ? startMonth : 1;
    const monthTo = year === endYear ? endMonth : 12;

    for (; monthFrom <= monthTo; monthFrom++) {
      dateRange.push({ year, month: monthFrom });
    }
  }

  return dateRange.reverse();
}
