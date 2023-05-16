<script lang="ts">
  import { page } from "$app/stores";
  import AddressSearch from "$lib/components/ui/AddressSearch.svelte";
  import Checkbox from "$lib/components/ui/Checkbox.svelte";
  import Modal from "$lib/components/ui/Modal.svelte";
  import { addressToString } from "$lib/geo/address.service";
  import { getAddress } from "$lib/geo/address.service.js";
  import type { AddressSearchResult, Position } from "$lib/geo/geo.types";
  import { startLocationWatching, stopLocationWatching } from "$lib/geo/location-watcher";
  import { jumpToCurrentLocation, jumpToLocation } from "$lib/map.service";
  import { locationStore } from "$lib/stores/location.store";
  import {
    getLocation,
    getUseCurrentLocation,
    saveLocation,
    saveUseCurrentLocation
  } from "$lib/supabase/location-service";

  export let open = false;
  let address = "";
  let useCurrentLocation: boolean;
  const supabase = $page.data.supabase;
  const userId = $page.data.session.user.id;

  const buttons = [
    {
      text: "Übernehmen",
      callback: () => {
        saveUseCurrentLocation(supabase, userId, useCurrentLocation);
        open = false;
      }
    }
  ];

  $: if (useCurrentLocation) {
    setAddressText($locationStore);
    jumpToCurrentLocation();
  }

  async function onOpen() {
    useCurrentLocation = await getUseCurrentLocation(supabase, userId);
    const location = await getLocation(supabase, userId);
    setAddressText(location);
  }

  async function setAddressText(location: Position) {
    const newAddress = await getAddress(location);

    if (newAddress) {
      address = addressToString(newAddress);
    }
  }

  async function searchCurrentLocation(event) {
    useCurrentLocation = event.target.checked;
    useCurrentLocation ? startLocationWatching() : stopLocationWatching();
  }

  async function handleAddressSelection(event: CustomEvent<AddressSearchResult>) {
    const location = event.detail.location;
    saveLocation($page.data.supabase, $page.data.session.user.id, location);
    jumpToLocation(location);
  }
</script>

<Modal bind:open openCallback={onOpen} {buttons}>
  <div class="m-2 flex flex-col gap-3">
    <AddressSearch searchText={address} on:addressSelected={handleAddressSelection} />
    <Checkbox label="Aktuellen Standort verwenden" checked={useCurrentLocation} on:change={searchCurrentLocation} />
  </div>
</Modal>
