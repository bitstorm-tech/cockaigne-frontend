<script lang="ts">
  import Button from "$lib/components/ui/Button.svelte";
  import Checkbox from "$lib/components/ui/Checkbox.svelte";
  import Modal from "$lib/components/ui/Modal.svelte";
  import { addressToString } from "$lib/geo/address.service";
  import { getAddress } from "$lib/geo/address.service.js";
  import type { Position } from "$lib/geo/geo.types";
  import LocationService from "$lib/geo/location.service.js";
  import locationService from "$lib/supabase/location-service";
  import Textarea from "../ui/Textarea.svelte";

  export let open = false;
  let address = "";
  let loading = false;
  let useCurrentLocation: boolean;
  let location: Position;

  const buttons = [
    {
      text: "Übernehmen",
      callback: () => {
        locationService.saveUseCurrentLocation(useCurrentLocation);
        locationService.saveLocation(location);
        open = false;
      }
    }
  ];

  async function onOpen() {
    useCurrentLocation = await locationService.useCurrentLocation();
    location = await locationService.getLocation();
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

      const position: Position = {
        latitude: +addresses[0].lat,
        longitude: +addresses[0].lon
      };

      location = position;
    }

    loading = false;
  }

  async function searchCurrentLocation(event) {
    useCurrentLocation = event.target.checked;
    useCurrentLocation ? LocationService.startWatching() : LocationService.stopWatching();
  }
</script>

<Modal bind:open openCallback={onOpen} {buttons}>
  <div class="m-2 flex flex-col gap-3">
    <Textarea label="Adresse" bind:value={address} on:enter={search} disabled={useCurrentLocation} lines={2} />
    <Button on:click={search} disabled={useCurrentLocation} {loading}>Suchen</Button>
    <Checkbox label="Aktuellen Standort verwenden" checked={useCurrentLocation} on:change={searchCurrentLocation} />
  </div>
</Modal>
