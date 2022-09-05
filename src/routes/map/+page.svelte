<script lang="ts">
  import { browser } from "$app/environment";
  import DealFilterModal from "$lib/components/map/DealFilterModal.svelte";
  import LocationSettingsModal from "$lib/components/map/LocationSettingsModal.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import LoadingSpinner from "$lib/components/ui/icons/LoadingSpinner.svelte";
  import LocationWatcher from "$lib/geo/location-watcher";
  import { MapService } from "$lib/map.service";
  import { onMount } from "svelte";

  let mapService: MapService;
  let searchCurrentAddress = false;
  let showLocationSettingsModal = false;
  let showDealFilterModal = false;

  onMount(async () => {
    if (!browser) {
      return;
    }

    const position = await LocationWatcher.getPosition();
    const location = [position.coords.longitude, position.coords.latitude];

    if (!mapService) {
      mapService = new MapService("map", location, 100);
    }
  });

  function jumpToCurrentLocation() {
    mapService.jumpToCurrentLocation();
  }
</script>

<div class="grid grid-cols-3 gap-2 m-3">
  <Button on:click={() => (showLocationSettingsModal = true)}>Standort Einstellungen</Button>
  <Button on:click={() => (showDealFilterModal = true)}>Deal Filter</Button>
  <Button on:click={jumpToCurrentLocation}>Zu aktuellem Standort springen</Button>
</div>
<div id="map" class="w-[calc(100vw-1.5rem)] h-[calc(100vh-9rem)] m-auto z-0">
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

<LocationSettingsModal {mapService} bind:open={showLocationSettingsModal} />
<DealFilterModal {mapService} bind:open={showDealFilterModal} />
