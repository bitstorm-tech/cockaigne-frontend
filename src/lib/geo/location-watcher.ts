import { browser } from "$app/environment";
import { page } from "$app/stores";
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
      const userId = get(page).data.session.user.id;
      saveLocation(supabase, userId, currentLocation).then();
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
  if (!browser) return;

  const supabase = get(page).data.supabase;
  const userId = get(page).data.session.user.id;
  const useCurrentLocation = await getUseCurrentLocation(supabase, userId);
  useCurrentLocation ? startLocationWatching() : stopLocationWatching();
}
