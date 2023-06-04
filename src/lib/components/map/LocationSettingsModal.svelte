<script lang="ts">
  import { page } from "$app/stores";
  import AddressSearch from "$lib/components/ui/AddressSearch.svelte";
  import Checkbox from "$lib/components/ui/Checkbox.svelte";
  import Modal from "$lib/components/ui/Modal.svelte";
  import { addressToString } from "$lib/geo/address.service";
  import { getAddress } from "$lib/geo/address.service.js";
  import type { AddressSearchResult, Position } from "$lib/geo/geo.types";
  import { isLocationWatcherStarted, startLocationWatching, stopLocationWatching } from "$lib/geo/location-watcher";
  import { jumpToLocation } from "$lib/map.service";
  import { locationStore } from "$lib/stores/location.store";
  import { getUseCurrentLocation, saveLocation, saveUseCurrentLocation } from "$lib/supabase/location-service";

  export let open = false;
  let address = "";
  let useCurrentLocation: boolean;
  const supabase = $page.data.supabase;
  const userId = $page.data.userId;

  const buttons = [
    {
      text: "Übernehmen",
      callback: () => {
        if (userId) {
          saveUseCurrentLocation(supabase, userId, useCurrentLocation);
        }
        open = false;
      }
    }
  ];

  $: if (useCurrentLocation) {
    setAddressText($locationStore);
  }

  async function onOpen() {
    useCurrentLocation = userId ? await getUseCurrentLocation(supabase, userId) : isLocationWatcherStarted();
    setAddressText($locationStore);
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
    stopLocationWatching();
    const location = event.detail.location;
    locationStore.set(location);
    useCurrentLocation = false;
    jumpToLocation(location);

    if (userId) {
      saveLocation(supabase, userId, location);
      saveUseCurrentLocation(supabase, userId, false);
    }
  }
</script>

<Modal bind:open openCallback={onOpen} {buttons}>
  <div class="m-2 flex flex-col gap-3">
    <AddressSearch searchText={address} on:addressSelected={handleAddressSelection} />
    <Checkbox label="Aktuellen Standort verwenden" checked={useCurrentLocation} on:change={searchCurrentLocation} />
  </div>
</Modal>
