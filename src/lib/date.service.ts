export function getNowAsIsoString(now = new Date(), offsetHours = 8): string {
  now.setUTCHours(now.getUTCHours() + 2 + offsetHours);
  return now.toISOString().substring(0, 16);
}
