<script lang="ts">
  import { browser } from "$app/environment";
  import DealFilterModal from "$lib/components/map/DealFilterModal.svelte";
  import LocationSettingsModal from "$lib/components/map/LocationSettingsModal.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import LoadingSpinner from "$lib/components/ui/icons/LoadingSpinner.svelte";
  import type { Position } from "$lib/geo/geo.types";
  import { MapService } from "$lib/map.service";
  import { locationStore, useCurrentLocationStore } from "$lib/store.service";
  import { onDestroy, onMount } from "svelte";
  import { addressToShortString, getAddress } from "../../lib/geo/address.service";

  export let data;

  let mapService: MapService;
  let searchCurrentAddress = false;
  let showLocationSettingsModal = false;
  let showDealFilterModal = false;
  let address = "";

  onMount(async () => {
    if (!browser) {
      return;
    }

    mapService = new MapService("map");

    if ($useCurrentLocationStore) {
      mapService.jumpToLocation($locationStore);
    }
    address = addressToShortString(await getAddress($locationStore));
  });

  const unsubscribe = locationStore.subscribe(async (position: Position) => {
    if (!mapService) {
      return;
    }

    mapService.jumpToLocation(position);
    address = addressToShortString(await getAddress(position));
  });

  onDestroy(unsubscribe);

  function jumpToCurrentLocation() {
    mapService.jumpToCurrentLocation();
  }
</script>

<div class="grid grid-cols-3 gap-2 m-3">
  <Button on:click={() => (showLocationSettingsModal = true)}>Standort Einstellungen</Button>
  <Button on:click={() => (showDealFilterModal = true)}>Deal Filter</Button>
  <Button on:click={jumpToCurrentLocation}>Zum Standort springen</Button>
</div>
<span class="p-3 text-2xs">Standort: {address}</span>
<div id="map" class="w-[calc(100vw-1.5rem)] h-[calc(100vh-12rem)] m-auto z-0">
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

<LocationSettingsModal bind:open={showLocationSettingsModal} />
<DealFilterModal {mapService} categories={data.categories} bind:open={showDealFilterModal} />
