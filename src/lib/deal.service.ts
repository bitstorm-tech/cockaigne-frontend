import type { Deal } from "$lib/database/deal/deal.model";

export enum DealState {
  IN_FUTURE,
  IN_PAST,
  ACTIVE
}

export function getDealState(deal: Deal): DealState {
  const start = deal.start.getTime();
  const end = start + deal.duration * 60 * 1000;
  const now = new Date().getTime();

  if (now >= start && now <= end) {
    return DealState.ACTIVE;
  }

  if (now > end) {
    return DealState.IN_PAST;
  }

  return DealState.IN_FUTURE;
}
