<script lang="ts">
  import { page } from "$app/stores";
  import Button from "$lib/components/ui/Button.svelte";
  import Checkbox from "$lib/components/ui/Checkbox.svelte";
  import Modal from "$lib/components/ui/Modal.svelte";
  import Textarea from "$lib/components/ui/Textarea.svelte";
  import { addressToString } from "$lib/geo/address.service";
  import { getAddress } from "$lib/geo/address.service.js";
  import type { Position } from "$lib/geo/geo.types";
  import { startLocationWatching, stopLocationWatching } from "$lib/geo/location-watcher";
  import { locationStore } from "$lib/stores/location.store";
  import {
    getLocation,
    getUseCurrentLocation,
    saveLocation,
    saveUseCurrentLocation
  } from "$lib/supabase/location-service";

  export let open = false;
  let address = "";
  let loading = false;
  let useCurrentLocation: boolean;
  const supabase = $page.data.supabase;
  const userId = $page.data.session.user.id;

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
        saveUseCurrentLocation(supabase, userId, useCurrentLocation);
        saveLocation(supabase, userId, $locationStore);
        open = false;
      }
    }
  ];

  async function onOpen() {
    useCurrentLocation = await getUseCurrentLocation(supabase, userId);
    const location = await getLocation(supabase, userId);
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
    useCurrentLocation ? startLocationWatching() : stopLocationWatching();
  }
</script>

<Modal bind:open openCallback={onOpen} {buttons}>
  <div class="m-2 flex flex-col gap-3">
    <Textarea label="Adresse" bind:value={address} on:enter={search} disabled={useCurrentLocation} lines={2} />
    <Button on:click={search} disabled={useCurrentLocation} {loading}>Suchen</Button>
    <Checkbox label="Aktuellen Standort verwenden" checked={useCurrentLocation} on:change={searchCurrentLocation} />
  </div>
</Modal>
