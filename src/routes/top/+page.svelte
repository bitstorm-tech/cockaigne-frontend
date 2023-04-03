<script lang="ts">
  import { browser } from "$app/environment";
  import ButtonGroup from "$lib/components/ui/ButtonGroup.svelte";
  import LoadingSpinner from "$lib/components/ui/icons/LoadingSpinner.svelte";
  import UserDealsList from "$lib/components/user/UserDealsList.svelte";
  import { likeStore } from "$lib/stores/like.store";
  import { navigationStore } from "$lib/stores/navigation.store";
  import dealService from "$lib/supabase/deal-service";
  import locationService from "$lib/supabase/location-service";
  import type { ActiveDeal } from "$lib/supabase/public-types";
  import { onMount } from "svelte";

  navigationStore.currentPage("top");

  const options = {
    "10": "TOP 10",
    "25": "TOP 25",
    "50": "TOP 50",
    "100": "Alle"
  };

  let loading = false;
  let selectedOption = "10";
  let topDeals: ActiveDeal[] = [];

  $: {
    selectedOption;
    loadDeals();
  }

  onMount(() => {
    likeStore.load();
    loadDeals();
  });

  async function loadDeals() {
    if (!browser) return;
    loading = true;

    const filter = await locationService.createFilterByCurrentLocationAndSelectedCategories();
    topDeals = await dealService.getDealsByFilter(filter);

    loading = false;
  }
</script>

<section class="flex flex-col">
  <div class="p-3">
    <p class="text-center">TOP-Deals in deiner Nähe</p>
    <div class="py-4">
      <ButtonGroup {options} bind:value={selectedOption} />
    </div>
  </div>
  <hr class="pb-2" />
  {#if loading}
    <div class="flex items-center justify-center gap-3 pt-6">
      <LoadingSpinner />
      <p>Suche die TOP-Deals ...</p>
    </div>
  {:else}
    <UserDealsList deals={topDeals} />
  {/if}
</section>
