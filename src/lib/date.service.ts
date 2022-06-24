export function getNowAsIsoString(now = new Date()): string {
  return now.toISOString().substring(0, 16);
}
