import { browser } from "$app/environment";
import _ from "lodash";
import type { AccountUpdateOptions } from "./database/account/account.model";
import { PUT } from "./http.service";

const KEY_PREFIX = "ckn.";
const KEYS = {
  searchRadius: KEY_PREFIX + "searchRadius",
  useCurrentLocation: KEY_PREFIX + "useCurrentLocation",
  useClickOnMap: KEY_PREFIX + "useClickOnMap",
  categories: KEY_PREFIX + "categories"
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

export class UserService {
  static saveSearchRadius(searchRadius: number, persistToDB = true) {
    setToLocalStorage(KEYS.searchRadius, searchRadius);

    if (persistToDB) {
      const update: AccountUpdateOptions = {
        search_radius: searchRadius
      };

      PUT("/api/accounts", update).then();
    }
  }

  static getSearchRadius(): number {
    return parseInt(getFromLocalStorage(KEYS.searchRadius, "100"));
  }

  static saveUseCurrentLocation(useCurrentLocation: boolean, persistToDB = true) {
    setToLocalStorage(KEYS.useCurrentLocation, useCurrentLocation);

    if (persistToDB) {
      const update: AccountUpdateOptions = {
        use_current_location: useCurrentLocation
      };

      PUT("/api/accounts", update).then();
    }
  }

  static getUseCurrentLocation(): boolean {
    return getFromLocalStorage(KEYS.useCurrentLocation, "false") === "true";
  }

  static saveUseClickOnMap(useClickOnMap: boolean, persistToDB = true) {
    setToLocalStorage(KEYS.useClickOnMap, useClickOnMap);

    if (persistToDB) {
      const update: AccountUpdateOptions = {
        use_click_on_map: useClickOnMap
      };

      PUT("/api/accounts", update).then();
    }
  }

  static getUseClickOnMap(): boolean {
    return getFromLocalStorage(KEYS.useClickOnMap, "false") === "true";
  }

  static getCategories(): number[] {
    const categories = getFromLocalStorage(KEYS.categories);
    return categories.split(",").map((category) => +category);
  }

  static toggleCategories(category: number) {
    const categories = UserService.getCategories();

    if (categories.includes(category)) {
      _.remove(categories, (c) => c === category);
    } else {
      categories.push(category);
    }

    setToLocalStorage(KEYS.categories, categories.join(","));
  }
}
