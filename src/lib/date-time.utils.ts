import { addMinutes } from "date-fns";
import formatInTimeZone from "date-fns-tz/formatInTimeZone";
import utcToZonedTime from "date-fns-tz/utcToZonedTime";

export function getDateTimeAsIsoString(date = new Date(), offsetInMinutes = 0, timezone = "Europe/Berlin"): string {
  const dateWithOffset = addMinutes(date, offsetInMinutes);
  return formatInTimeZone(dateWithOffset, timezone, "yyyy-MM-dd'T'HH:mm");
}

export function getDateAsIsoString(date = new Date(), offsetInMinutes = 0, timezone = "Europe/Berlin"): string {
  const dateWithOffset = addMinutes(date, offsetInMinutes);
  return formatInTimeZone(dateWithOffset, timezone, "yyyy-MM-dd");
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
