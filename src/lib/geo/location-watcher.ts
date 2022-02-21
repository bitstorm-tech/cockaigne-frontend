export default class LocationWatcher {
  watcherId: number;

  constructor(private callback: (position: GeolocationPosition) => void) {}

  startWatching() {
    if (this.callback) {
      this.watcherId = window.navigator.geolocation.watchPosition(this.callback);
    }
  }

  stopWatching() {
    if (this.watcherId) {
      window.navigator.geolocation.clearWatch(this.watcherId);
    }
  }

  static getPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject));
  }
}
