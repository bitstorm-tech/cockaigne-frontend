<script lang="ts">
  import Button from "$lib/components/ui/Button.svelte";
  import Checkbox from "$lib/components/ui/Checkbox.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import Modal from "$lib/components/ui/Modal.svelte";
  import { getAddress } from "$lib/geo/address.service.js";
  import LocationWatcher from "$lib/geo/location-watcher.js";
  import { MapService } from "$lib/map.service.js";

  export let mapService: MapService;
  export let open = false;

  let latitude: number;
  let longitude: number;
  let enableClick = true;
  let useCurrentLocation = false;
  let address = "";
  let searchCurrentAddress = false;

  async function search() {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${address}`;
    const response = await fetch(url);

    if (response.ok) {
      const addresses = await response.json();
      if (addresses.length === 0) {
        return;
      }

      latitude = +addresses[0].lat;
      longitude = +addresses[0].lon;
      mapService.jumpToLocation([longitude, latitude]);
    }
  }

  async function searchCurrentLocation(event) {
    useCurrentLocation = event.target.checked;
    address = "";
    enableClick = false;

    if (useCurrentLocation) {
      searchCurrentAddress = true;
      const position = await LocationWatcher.getPosition();
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      address = await getAddress(latitude, longitude);
      mapService.jumpToLocation([longitude, latitude]);
      searchCurrentAddress = false;
    }
  }

  function changeEnableClick() {
    mapService.setEnableClick(enableClick);
  }
</script>

<Modal bind:open>
  <div class="flex flex-col m-2">
    <div class="flex gap-2 items-end">
      <Input label="Adresse" bind:value={address} on:enter={search} disabled={useCurrentLocation} />
      <Button on:click={search} disabled={useCurrentLocation}>Suchen</Button>
    </div>
    <Checkbox label="Aktuellen Standort verwenden" on:change={searchCurrentLocation} />
    <Checkbox label="Standort per Click wählen" bind:checked={enableClick} on:change={changeEnableClick} />
  </div>
</Modal>
