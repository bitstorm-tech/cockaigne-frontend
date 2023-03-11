<script lang="ts">
  import { browser } from "$app/environment";
  import DealFilterModal from "$lib/components/map/DealFilterModal.svelte";
  import LocationSettingsModal from "$lib/components/map/LocationSettingsModal.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import CurrentLocationIcon from "$lib/components/ui/icons/CurrentLocationIcon.svelte";
  import FilterIcon from "$lib/components/ui/icons/FilterIcon.svelte";
  import LoadingSpinner from "$lib/components/ui/icons/LoadingSpinner.svelte";
  import LocationIcon from "$lib/components/ui/icons/LocationIcon.svelte";
  import type { Position } from "$lib/geo/geo.types";
  import { MapService } from "$lib/map.service";
  import { navigationStore } from "$lib/stores/navigation.store";
  import locationService from "$lib/supabase/location-service";
  import { onDestroy, onMount } from "svelte";
  import type { PageData } from "./$types";

  export let data: PageData;

  let mapService: MapService;
  let searchCurrentAddress = false;
  let showLocationSettingsModal = false;
  let showDealFilterModal = data?.showDealFilterModal;

  navigationStore.currentPage("map");

  onMount(async () => {
    if (!browser) {
      return;
    }

    const location = await locationService.getLocation();
    mapService = await MapService.init("map");
    mapService.jumpToLocation(location);
  });

  function jumpToCurrentLocation() {
    mapService.jumpToCurrentLocation();
  }
</script>

<div class="fixed top-12 right-1 z-10 m-3 grid grid-cols-3 gap-2">
  <Button circle on:click={() => (showLocationSettingsModal = true)}>
    <LocationIcon />
  </Button>
  <Button circle on:click={() => (showDealFilterModal = true)}>
    <FilterIcon />
  </Button>
  <Button circle on:click={jumpToCurrentLocation}>
    <CurrentLocationIcon />
  </Button>
</div>
<div id="map" class="h-[calc(100vh-6rem)] w-screen">
  {#if !mapService}
    <div class="mt-16 flex content-center justify-center gap-2">
      <h2>Lade Karte</h2>
      <LoadingSpinner />
    </div>
  {/if}
  {#if searchCurrentAddress}
    <div class="relative top-1/3 z-[1000] flex content-center justify-center gap-4 bg-gray-500 py-6 text-xl opacity-75">
      <span>Ermittele aktuellen Standort</span>
      <LoadingSpinner />
    </div>
  {/if}
</div>

<LocationSettingsModal bind:open={showLocationSettingsModal} />
<DealFilterModal {mapService} categories={data.categories} bind:open={showDealFilterModal} />
