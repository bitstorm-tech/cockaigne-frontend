<script lang="ts">
  import { browser } from "$app/environment";
  import Button from "$lib/components/ui/Button.svelte";
  import Checkbox from "$lib/components/ui/Checkbox.svelte";
  import LoadingSpinner from "$lib/components/ui/icons/LoadingSpinner.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import { getAddress } from "$lib/geo/address.service";
  import LocationWatcher from "$lib/geo/location-watcher";
  import { MapService } from "$lib/map.service";
  import { onMount } from "svelte";

  let useCurrentLocation = false;
  let address = "";
  let mapService: MapService;
  let searchCurrentAddress = false;
  let searchRadius = 1;
  let latitude: number;
  let longitude: number;

  onMount(async () => {
    if (!browser) {
      return;
    }

    const position = await LocationWatcher.getPosition();
    const location = [position.coords.longitude, position.coords.latitude];

    if (!mapService) {
      mapService = new MapService("map", location);
    }
  });

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

  function jumpToCurrentLocation() {
    mapService.jumpToCurrentLocation();
  }

  function changeSearchRadius() {
    mapService.setRadius(searchRadius);
  }
</script>

<div class="flex flex-col m-2">
  <div class="flex gap-2 items-end">
    <Input label="Adresse" bind:value={address} on:enter={search} disabled={useCurrentLocation} />
    <Button on:click={search} disabled={useCurrentLocation}>Suchen</Button>
  </div>
  <div class="flex gap-2 justify-between items-center">
    <Checkbox label="Aktuellen Standort verwenden" on:change={searchCurrentLocation} />
    <Button small on:click={jumpToCurrentLocation} disabled={address.length === 0}
      >Zu aktuellem Standort springen</Button
    >
  </div>
  <input
    class="range"
    type="range"
    min="1"
    max="10"
    step="0.5"
    bind:value={searchRadius}
    on:input={changeSearchRadius}
  />
</div>

<div id="map" class="w-[calc(100vw-1.5rem)] h-[calc(100vh-14rem)] m-auto z-0">
  {#if !mapService}
    <div class="flex justify-center content-center gap-2 mt-16">
      <h2>Lade Karte</h2>
      <LoadingSpinner />
    </div>
  {/if}
  {#if searchCurrentAddress}
    <div class="flex gap-4 justify-center content-center relative z-[1000] top-1/3 text-xl bg-gray-500 py-6 opacity-75">
      <span>Ermittele aktuellen Standort</span>
      <LoadingSpinner />
    </div>
  {/if}
</div>
