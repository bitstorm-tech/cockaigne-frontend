import { addMinutes, format, parseISO } from "date-fns";
import formatInTimeZone from "date-fns-tz/formatInTimeZone";
import utcToZonedTime from "date-fns-tz/utcToZonedTime";
import type { Deal } from "./supabase/public-types";

const DATE_FORMAT = "yyyy-MM-dd";
const DATE_TIME_FORMAT_WITHOUT_TIMEZONE = DATE_FORMAT + "'T'HH:mm";

export function getDateTimeAsIsoString(date = new Date(), offsetInMinutes = 0, timezone = "Europe/Berlin"): string {
  const dateWithOffset = addMinutes(date, offsetInMinutes);
  return formatInTimeZone(dateWithOffset, timezone, DATE_TIME_FORMAT_WITHOUT_TIMEZONE);
}

export function getDateAsIsoString(date = new Date(), offsetInMinutes = 0, timezone = "Europe/Berlin"): string {
  const dateWithOffset = addMinutes(date, offsetInMinutes);
  return formatInTimeZone(dateWithOffset, timezone, DATE_FORMAT);
}

export function extractTimeFromDateTimeString(dateTime: string): string {
  return dateTime.split("T")[1];
}

export function dateToUnixTimestamp(date: string | number, time = ""): number {
  const dateTime = time.length > 0 ? date + "T" + time : date;
  return new Date(dateTime).getTime() / 1000;
}

export function convertToTimeZonedDateTimeString(date: string | Date | number, timezone = "Europe/Berlin"): string {
  const timeZonedDate = utcToZonedTime(date, timezone);
  return getDateTimeAsIsoString(timeZonedDate);
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

function addTimezoneOffsetToDeal(deal: Deal) {
  deal.start = addTimezoneOffset(deal.start);
}

function removeTimezoneOffsetFromDeal(deal: Deal) {
  deal.start = removeTimezoneOffset(deal.start);
}

export default {
  addTimezoneOffset,
  addTimezoneOffsetToDeal,
  removeTimezoneOffsetFromDeal
};
