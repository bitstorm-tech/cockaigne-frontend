<script lang="ts" context="module">
  export async function load({ fetch }: LoadEvent) {
    const response = await fetch("/api/deals?filter=own");

    if (response.ok) {
      const deals = await response.json();
      return {
        props: {
          deals
        }
      };
    }
  }
</script>

<script lang="ts">
  import { goto } from "$app/navigation";
  import DealsList from "$lib/components/dealer/DealsList.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import type { Deal } from "$lib/database/deal/deal.model";
  import { sortDealsByState } from "$lib/deal.service";
  import type { LoadEvent } from "@sveltejs/kit";

  export let deals: Deal[] = [];

  $: sortedDeals = sortDealsByState(deals);

  let showTabIndex = 0;
</script>

<div class="flex flex-col p-3">
  <div class="grid grid-cols-2 gap-3">
    <Button on:click={() => goto("/deals/new")}>Deal erstellen</Button>
    <Button outline>Vorlagen</Button>
  </div>
</div>
<div class="tabs mt-6 max-h-8 mb-2">
  <button on:click={() => (showTabIndex = 0)} class="tab tab-bordered grow" class:tab-active={showTabIndex === 0}>
    Aktiv
  </button>
  <button on:click={() => (showTabIndex = 1)} class="tab tab-bordered grow" class:tab-active={showTabIndex === 1}>
    Geplant
  </button>
  <button on:click={() => (showTabIndex = 2)} class="tab tab-bordered grow" class:tab-active={showTabIndex === 2}>
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
