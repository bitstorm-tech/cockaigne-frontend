import { locationStore } from "$lib/stores/location.store";
import { debounce } from "lodash";
import type { Position } from "./geo.types";

const saveLocation = debounce(async () => {
  locationStore.save();
}, 1000);

export default class LocationService {
  private static watcherId = -1;

  static startWatching() {
    if (this.watcherId === -1) {
      console.log("[LocationWatcher] start watching ...");
      this.watcherId = window.navigator.geolocation.watchPosition((geolocationPosition) => {
        const position = {
          longitude: geolocationPosition.coords.longitude,
          latitude: geolocationPosition.coords.latitude
        };
        this.setPosition(position);
      });
    }
  }

  static stopWatching() {
    if (this.watcherId) {
      console.log("[LocationWatcher] stop watching ...");
      window.navigator.geolocation.clearWatch(this.watcherId);
      this.watcherId = -1;
    }
  }

  static setPosition(position: Position) {
    locationStore.set(position);
    saveLocation();
  }
}
