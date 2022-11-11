import { StoreService } from "../store.service";
import type { Position } from "./geo.types";

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
    StoreService.saveLocation(position);
  }
}
