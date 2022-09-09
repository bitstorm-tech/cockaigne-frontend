import { browser } from "$app/environment";
import type { AccountUpdateOptions } from "./database/account/account.model";
import { PUT } from "./http.service";

const KEY_PREFIX = "ckn.";
const KEYS = {
  searchRadius: KEY_PREFIX + "searchRadius",
  useCurrentLocation: KEY_PREFIX + "useCurrentLocation",
  useClickOnMap: KEY_PREFIX + "useClickOnMap"
};

function getFromLocalStorage(key: string, fallbackValue = ""): string {
  if (browser) {
    return localStorage.getItem(key) || fallbackValue;
  }

  return fallbackValue;
}

function setToLocalStorage(key: string, value: string | number | boolean) {
  if (browser) {
    localStorage.setItem(key, value.toString());
  }
}

export const UserService = {
  saveSearchRadius: (searchRadius: number, persistToDB = true) => {
    setToLocalStorage(KEYS.searchRadius, searchRadius);

    if (persistToDB) {
      const update: AccountUpdateOptions = {
        search_radius: searchRadius
      };

      PUT("/api/accounts", update).then();
    }
  },

  getSearchRadius: (): number => {
    return parseInt(getFromLocalStorage(KEYS.searchRadius, "100"));
  },

  saveUseCurrentLocation: (useCurrentLocation: boolean, persistToDB = true) => {
    setToLocalStorage(KEYS.useCurrentLocation, useCurrentLocation);

    if (persistToDB) {
      const update: AccountUpdateOptions = {
        use_current_location: useCurrentLocation
      };

      PUT("/api/accounts", update).then();
    }
  },

  getUseCurrentLocation: (): boolean => {
    return getFromLocalStorage(KEYS.useCurrentLocation, "false") === "true";
  },

  saveUseClickOnMap: (useClickOnMap: boolean, persistToDB = true) => {
    setToLocalStorage(KEYS.useClickOnMap, useClickOnMap);

    if (persistToDB) {
      const update: AccountUpdateOptions = {
        use_click_on_map: useClickOnMap
      };

      PUT("/api/accounts", update).then();
    }
  },

  getUseClickOnMap: (): boolean => {
    return getFromLocalStorage(KEYS.useClickOnMap, "false") === "true";
  }
};
