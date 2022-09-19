<script lang="ts">
  import DealsListItem from "$lib/components/dealer/DealsListItem.svelte";
  import EmptyContent from "$lib/components/ui/EmptyContent.svelte";
  import HeartIcon from "$lib/components/ui/icons/HeartIcon.svelte";
  import Link from "$lib/components/ui/Link.svelte";
  import type { Deal } from "$lib/database/deal/deal.model";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let deals: Deal[] = [];
  export let favoriteDeals: Deal[] = [];
  let openDetail = -1;

  function favor(deal: Deal) {
    dispatch("favor", deal);
  }

  function isFavorite(dealId: number): boolean {
    return !!favoriteDeals.find((fav) => fav.id === dealId);
  }
</script>

<div class="flex flex-col gap-4">
  {#if deals.length === 0}
    <EmptyContent>
      <p>Aktuell gibt es leider keine Deals in deiner Nähe :(</p>
      <p>
        <Link href="/map" underline>Filter anpassen</Link> oder
        <Link href="/map" underline>Standort ändern</Link>!
      </p>
    </EmptyContent>
  {/if}
  {#each deals as deal, i}
    <DealsListItem {deal} showDetails={openDetail === i} on:click={() => (openDetail = openDetail === i ? -1 : i)}>
      <div class="cursor-pointer" on:click={() => favor(deal)}>
        <HeartIcon outline={!isFavorite(deal.id)} />
      </div>
    </DealsListItem>
  {/each}
</div>
