import { getContext, setContext } from "svelte";
import type { Writable } from "svelte/store";
import { writable } from "svelte/store";

const store = writable<UserState>();
const key: unique symbol = Symbol();

export interface UserState {
  id?: number;
  isAuthenticated?: boolean;
  isDealer?: boolean;
  radius?: number;
  useClickOnMap?: boolean;
  useCurrentLocation?: boolean;
  selectedCategories?: number[];
}

export function updateUserStore(userState: UserState): Writable<UserState> {
  store.update((previousState) => {
    return {
      ...previousState,
      ...userState
    };
  });
  setContext(key, store);
  return store;
}

export function getUserStore(): Writable<UserState> {
  return getContext(key);
}
