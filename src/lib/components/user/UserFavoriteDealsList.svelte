<script lang="ts">
  import DealsListItem from "$lib/components/dealer/DealsListItem.svelte";
  import EmptyContent from "$lib/components/ui/EmptyContent.svelte";
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

<div class="flex flex-col justify-center gap-4">
  {#if favoriteDeals.length === 0}
    <EmptyContent>
      <p>Hier gibt es noch keine heißen Deals.</p>
      <p>Worauf wartest du?</p>
    </EmptyContent>
  {/if}
  {#each favoriteDeals as deal, i}
    <DealsListItem {deal} showDetails={openDetail === i} on:click={() => (openDetail = openDetail === i ? -1 : i)}>
      <button class="cursor-pointer" on:click={() => disfavor(deal)}>
        <HeartIcon outline={false} />
      </button>
    </DealsListItem>
  {/each}
</div>
