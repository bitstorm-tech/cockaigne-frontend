<script lang="ts">
  import Button from "$lib/components/ui/Button.svelte";
  import Checkbox from "$lib/components/ui/Checkbox.svelte";
  import Modal from "$lib/components/ui/Modal.svelte";
  import { addressToString } from "$lib/geo/address.service";
  import { getAddress } from "$lib/geo/address.service.js";
  import type { Position } from "$lib/geo/geo.types";
  import LocationService from "$lib/geo/location.service.js";
  import { locationStore } from "$lib/stores/location.store";
  import { useCurrentLocationStore } from "$lib/stores/use-current-location.store";
  import { debounce } from "lodash";
  import { onDestroy } from "svelte";
  import Textarea from "../ui/Textarea.svelte";

  export let open = false;
  let address = "";
  let loading = false;

  const buttons = [
    {
      text: "Übernehmen",
      callback: () => {
        open = false;
      }
    }
  ];

  const unsubscribe = locationStore.subscribe(async (position: Position) => {
    const newAddress = await getAddress(position);

    if (newAddress) {
      address = addressToString(newAddress);
    }
  });

  onDestroy(unsubscribe);

  const saveUseCurrentLocation = debounce(() => {
    useCurrentLocationStore.save();
  }, 2000);

  async function search() {
    loading = true;
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

      locationStore.set(position);
      locationStore.save();
    }

    loading = false;
  }

  async function searchCurrentLocation(event) {
    useCurrentLocationStore.set(event.target.checked);
    saveUseCurrentLocation();
    $useCurrentLocationStore ? LocationService.startWatching() : LocationService.stopWatching();
  }
</script>

<Modal bind:open {buttons}>
  <div class="m-2 flex flex-col gap-3">
    <Textarea label="Adresse" bind:value={address} on:enter={search} disabled={$useCurrentLocationStore} lines={2} />
    <Button on:click={search} disabled={$useCurrentLocationStore} {loading}>Suchen</Button>
    <Checkbox
      label="Aktuellen Standort verwenden"
      bind:checked={$useCurrentLocationStore}
      on:change={searchCurrentLocation}
    />
  </div>
</Modal>
