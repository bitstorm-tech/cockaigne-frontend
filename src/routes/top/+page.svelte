<script lang="ts">
  import { browser } from "$app/environment";
  import ButtonGroup from "$lib/components/ui/ButtonGroup.svelte";
  import LoadingSpinner from "$lib/components/ui/icons/LoadingSpinner.svelte";
  import UserDealsList from "$lib/components/user/UserDealsList.svelte";
  import type { Deal, DealFilter } from "$lib/database/deal/deal.model";
  import { POST } from "$lib/http.utils";
  import { StoreService } from "$lib/store.service";
  import { likeStore } from "$lib/stores/like.store";
  import { onMount } from "svelte";

  const options = {
    "10": "TOP 10",
    "25": "TOP 25",
    "50": "TOP 50",
    "100": "Alle"
  };

  let loading = false;
  let selectedOption = "10";
  let topDeals: Deal[] = [];

  $: loadDeals() && selectedOption;

  onMount(() => {
    likeStore.load();
    loadDeals();
  });

  async function loadDeals() {
    if (!browser) return;
    loading = true;
    const filter: DealFilter = {
      limit: +selectedOption,
      radius: StoreService.getSearchRadius(),
      location: StoreService.getLocation()
    };
    const response = await fetch("/api/deals/top", POST(filter));

    if (response.ok) {
      topDeals = await response.json();
    }

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
    <div class="flex justify-center items-center gap-3 pt-6">
      <LoadingSpinner />
      <p>Suche die TOP-Deals ...</p>
    </div>
  {:else}
    <UserDealsList deals={topDeals} />
  {/if}
</section>
