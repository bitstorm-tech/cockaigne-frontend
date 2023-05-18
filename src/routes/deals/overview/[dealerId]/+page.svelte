<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import DealsList from "$lib/components/dealer/DealsList.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import { sortDealsByState } from "$lib/deal.utils";
  import type { Deal } from "$lib/supabase/public-types.js";

  export let data;
  const deals: Deal[] = data.deals;

  $: sortedDeals = sortDealsByState(deals);

  let showTabIndex = 0;
</script>

<div class="flex flex-col p-3">
  <div class="grid grid-cols-2 gap-3">
    <Button warning on:click={() => goto("/deals/new?dealerId=" + $page.data.userId)}>Deal erstellen</Button>
    <Button on:click={() => goto("/deals/templates")}>Vorlagen</Button>
  </div>
</div>
<div class="tabs mb-2 mt-6 max-h-8">
  <button on:click={() => (showTabIndex = 0)} class="tab-bordered tab grow" class:tab-active={showTabIndex === 0}>
    Aktiv
  </button>
  <button on:click={() => (showTabIndex = 1)} class="tab-bordered tab grow" class:tab-active={showTabIndex === 1}>
    Geplant
  </button>
  <button on:click={() => (showTabIndex = 2)} class="tab-bordered tab grow" class:tab-active={showTabIndex === 2}>
    Abgelaufen
  </button>
</div>
{#if showTabIndex === 0}
  <DealsList deals={sortedDeals.active} />
{:else if showTabIndex === 1}
  <DealsList deals={sortedDeals.future} />
{:else}
  <DealsList deals={sortedDeals.past} />
{/if}
