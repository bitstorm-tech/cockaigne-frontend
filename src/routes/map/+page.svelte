<script lang="ts">
  import { page } from "$app/stores";
  import DealFilterModal from "$lib/components/map/DealFilterModal.svelte";
  import LocationSettingsModal from "$lib/components/map/LocationSettingsModal.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import CurrentLocationIcon from "$lib/components/ui/icons/CurrentLocationIcon.svelte";
  import FilterIcon from "$lib/components/ui/icons/FilterIcon.svelte";
  import LoadingSpinner from "$lib/components/ui/icons/LoadingSpinner.svelte";
  import LocationIcon from "$lib/components/ui/icons/LocationIcon.svelte";
  import { initMapService, jumpToCurrentLocation, jumpToLocation } from "$lib/map.service";
  import { navigationStore } from "$lib/stores/navigation.store";
  import { getLocation } from "$lib/supabase/location-service";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";

  export let data: PageData;

  let searchCurrentAddress = false;
  let showLocationSettingsModal = false;
  let showDealFilterModal = data.showDealFilterModal;
  const supabase = $page.data.supabase;
  const userId = $page.data.userId;

  navigationStore.currentPage("map");

  onMount(async () => {
    await initMapService("map");
    if (!userId) return;
    const location = await getLocation(supabase, userId);
    jumpToLocation(location);
  });
</script>

<div class="fixed right-1 top-12 z-10 m-3 grid grid-cols-3 gap-2">
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
  {#if searchCurrentAddress}
    <div class="relative top-1/3 z-[1000] flex content-center justify-center gap-4 bg-gray-500 py-6 text-xl opacity-75">
      <span>Ermittele aktuellen Standort</span>
      <LoadingSpinner />
    </div>
  {/if}
</div>

<LocationSettingsModal bind:open={showLocationSettingsModal} />
<DealFilterModal categories={data.categories} bind:open={showDealFilterModal} />
