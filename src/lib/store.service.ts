import { browser } from "$app/environment";
import { writable } from "svelte/store";
import type { AccountUpdateOptions } from "./database/account/account.model";
import type { Position } from "./geo/geo.types";
import { munichPosition } from "./geo/geo.types";
import { PUT } from "./http.utils";

const KEY_PREFIX = "ckn.";
const KEYS = {
  useCurrentLocation: KEY_PREFIX + "useCurrentLocation",
  location: KEY_PREFIX + "location"
};

export const useCurrentLocationStore = writable<boolean>(false);
export const locationStore = writable<Position>(munichPosition);

export class StoreService {
  static init() {
    const useCurrentLocation = this.getUseCurrentLocation();
    const location = this.getLocation();

    useCurrentLocationStore.set(useCurrentLocation);
    locationStore.set(location);
  }

  static saveUseCurrentLocation(useCurrentLocation: boolean, persistToDB = true) {
    this.setToLocalStorage(KEYS.useCurrentLocation, useCurrentLocation);
    useCurrentLocationStore.set(useCurrentLocation);

    if (persistToDB) {
      const update: AccountUpdateOptions = {
        use_current_location: useCurrentLocation
      };

      fetch("/api/accounts", PUT(update)).then();
    }
  }

  static getUseCurrentLocation(): boolean {
    return this.getFromLocalStorage(KEYS.useCurrentLocation, "false") === "true";
  }

  static saveLocation(position: Position) {
    this.setToLocalStorage(KEYS.location, `${position.longitude} ${position.latitude}`);
    locationStore.set(position);
  }

  static getLocation(): Position {
    const longLatString = this.getFromLocalStorage(KEYS.location);

    if (!longLatString) {
      return munichPosition;
    }

    const [longitude, latitude] = longLatString.split(" ").map((longLat) => +longLat.trim());

    return {
      longitude,
      latitude
    };
  }

  private static getFromLocalStorage(key: string, fallbackValue = ""): string {
    if (!browser) {
      return fallbackValue;
    }

    const value = localStorage.getItem(key);
    if (!value) {
      this.setToLocalStorage(key, fallbackValue);
      return fallbackValue;
    }

    return value;
  }

  private static setToLocalStorage(key: string, value: string | number | boolean) {
    if (browser) {
      localStorage.setItem(key, value.toString());
    }
  }
}
