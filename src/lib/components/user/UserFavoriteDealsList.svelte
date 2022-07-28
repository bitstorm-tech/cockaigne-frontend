<script lang="ts">
  import DealsListItem from "$lib/components/dealer/DealsListItem.svelte";
  import HeartIcon from "$lib/components/ui/icons/HeartIcon.svelte";
  import type { Deal } from "$lib/database/deal/deal.model";
  import { createEventDispatcher } from "svelte";

  export let favoriteDeals: Deal[] = [];
  const dispatch = createEventDispatcher();
  let openDetail = -1;

  function disfavor(deal: Deal) {
    dispatch("disfavor", deal);
  }
</script>

<div class="flex flex-col gap-4">
  {#if favoriteDeals.length === 0}
    <p class="text-opacity-30 text-gray-200 pt-10 text-center">
      Du hast noch keine favorisierten Deals. Worauf wartest du?
    </p>
  {/if}
  {#each favoriteDeals as deal, i}
    <DealsListItem {deal} showDetails={openDetail === i} on:click={() => (openDetail = openDetail === i ? -1 : i)}>
      <div class="cursor-pointer" on:click={() => disfavor(deal)}>
        <HeartIcon outline={false} />
      </div>
    </DealsListItem>
  {/each}
</div>
