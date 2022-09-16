<script lang="ts">
  import Button from "$lib/components/ui/Button.svelte";
  import Checkbox from "$lib/components/ui/Checkbox.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import Modal from "$lib/components/ui/Modal.svelte";
  import { getAddress } from "$lib/geo/address.service.js";
  import _ from "lodash";
  import { onDestroy } from "svelte";
  import { addressToString } from "../../geo/address.service";
  import type { Position } from "../../geo/geo.types";
  import LocationService from "../../geo/location.service.js";
  import { locationStore, StoreService, useCurrentLocationStore } from "../../store.service";

  export let open = false;
  let address = "";

  const unsubscribe = locationStore.subscribe(async (position: Position) => {
    address = addressToString(await getAddress(position));
  });

  onDestroy(unsubscribe);

  const saveUseCurrentLocation = _.debounce(() => {
    StoreService.saveUseCurrentLocation($useCurrentLocationStore);
  }, 2000);

  async function search() {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${address}`;
    const response = await fetch(url);

    if (response.ok) {
      const addresses = await response.json();
      if (addresses.length === 0) {
        return;
      }

      const position: Position = {
        latitude: +addresses[0].lat,
        longitude: +addresses[0].lon
      };

      StoreService.saveLocation(position);
    }
  }

  async function searchCurrentLocation(event) {
    useCurrentLocationStore.set(event.target.checked);
    saveUseCurrentLocation();
    $useCurrentLocationStore ? LocationService.startWatching() : LocationService.stopWatching();
  }
</script>

<Modal bind:open>
  <div class="flex flex-col m-2 gap-2">
    <div class="flex gap-2 items-end">
      <Input label="Adresse" bind:value={address} on:enter={search} disabled={$useCurrentLocationStore} />
      <Button on:click={search} disabled={$useCurrentLocationStore}>Suchen</Button>
    </div>
    <Checkbox
      label="Aktuellen Standort verwenden"
      bind:checked={$useCurrentLocationStore}
      on:change={searchCurrentLocation}
    />
  </div>
</Modal>
