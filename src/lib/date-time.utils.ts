import { addMinutes } from "date-fns";
import formatInTimeZone from "date-fns-tz/formatInTimeZone";
import utcToZonedTime from "date-fns-tz/utcToZonedTime";

export function getDateAsIsoString(date = new Date(), offsetInMinutes = 0, timezone = "Europe/Berlin"): string {
  const offsettedDate = addMinutes(date, offsetInMinutes);
  return formatInTimeZone(offsettedDate, timezone, "yyyy-MM-dd'T'HH:mm");
}

export function convertToTimeZonedDateString(date: string | Date | number, timezone = "Europe/Berlin"): string {
  const timeZonedDate = utcToZonedTime(date, timezone);
  return getDateAsIsoString(timeZonedDate);
}
