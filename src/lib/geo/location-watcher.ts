import { browser } from "$app/environment";
import { page } from "$app/stores";
import { locationStore } from "$lib/stores/location.store";
import { getUseCurrentLocation, saveLocation } from "$lib/supabase/location-service";
import { get } from "svelte/store";

let watcherId = -1;

export function startLocationWatching() {
  if (watcherId === -1 && browser) {
    console.log("[LocationWatcher] start watching ...");
    watcherId = window.navigator.geolocation.watchPosition((geolocationPosition) => {
      const currentLocation = {
        longitude: geolocationPosition.coords.longitude,
        latitude: geolocationPosition.coords.latitude
      };
      // setLocation(currentLocation);
      const supabase = get(page).data.supabase;
      const userId = get(page).data.userId;
      locationStore.set(currentLocation);

      if (userId) {
        saveLocation(supabase, userId, currentLocation).then();
      }
    });
  }
}

export function stopLocationWatching() {
  if (watcherId && browser) {
    console.log("[LocationWatcher] stop watching ...");
    window.navigator.geolocation.clearWatch(watcherId);
    watcherId = -1;
  }
}

export async function initLocationWatcher() {
  const userId = get(page).data.userId;

  if (!browser || !userId) return;

  const supabase = get(page).data.supabase;
  const useCurrentLocation = await getUseCurrentLocation(supabase, userId);
  useCurrentLocation ? startLocationWatching() : stopLocationWatching();
}
