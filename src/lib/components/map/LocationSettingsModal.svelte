<script lang="ts">
  import { addressToString } from "$lib/geo/address.service";
  import { getAddress } from "$lib/geo/address.service.js";
  import type { Position } from "$lib/geo/geo.types";
  import LocationService from "$lib/geo/location.service.js";
  import { locationStore } from "$lib/stores/location.store";
  import locationService from "$lib/supabase/location-service";

  export let open = false;
  let address = "";
  let loading = false;
  let useCurrentLocation: boolean;

  $: (async () => {
    const newAddress = await getAddress($locationStore);

    if (newAddress) {
      address = addressToString(newAddress);
    }
  })();

  const buttons = [
    {
      text: "Übernehmen",
      callback: () => {
        locationService.saveUseCurrentLocation(useCurrentLocation);
        locationService.saveLocation($locationStore);
        open = false;
      }
    }
  ];

  async function onOpen() {
    useCurrentLocation = await locationService.useCurrentLocation();
    const location = await locationService.getLocation();
    const newAddress = await getAddress(location);

    if (newAddress) {
      address = addressToString(newAddress);
    }
  }

  async function search() {
    loading = true;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${address}`;
    const response = await fetch(url);

    if (response.ok) {
      const addresses = await response.json();
      if (addresses.length === 0) {
        return;
      }

      const location: Position = {
        latitude: +addresses[0].lat,
        longitude: +addresses[0].lon
      };

      locationStore.set(location);
      // const newAddress = await getAddress(location);
      //
      // if (newAddress) {
      //   address = addressToString(newAddress);
      // }
    }

    loading = false;
  }

  async function searchCurrentLocation(event) {
    useCurrentLocation = event.target.checked;
    useCurrentLocation ? LocationService.startWatching() : LocationService.stopWatching();
  }
</script>
