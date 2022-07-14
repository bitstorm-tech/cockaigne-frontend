<script lang="ts">
  import { goto } from "$app/navigation";
  import { session } from "$app/stores";
  import DealsListItem from "$lib/components/dealer/DealsListItem.svelte";
  import GearIcon from "$lib/components/ui/icons/GearIcon.svelte";
  import HeartIcon from "$lib/components/ui/icons/HeartIcon.svelte";
  import type { Deal } from "$lib/database/deal/deal.model";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let deals: Deal[] = [];
  export let favoriteDeals: Deal[] = [];
  const isUser = !$session.isDealer;
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
    <span class="text-opacity-30 text-gray-200 m-auto pt-10"> Du hast keine aktiven Deals. Worauf wartest du? </span>
  {/if}
  {#each deals as deal, i}
    <DealsListItem
      {deal}
      {isUser}
      showDetails={openDetail === i}
      on:click={() => (openDetail = openDetail === i ? -1 : i)}
    >
      <div class="cursor-pointer">
        {#if isUser}
          <HeartIcon outline={!isFavorite(deal.id)} on:click={() => favor(deal)} />
        {:else}
          <GearIcon on:click={() => goto("/deals/" + deal.id.toString())} />
        {/if}
      </div>
    </DealsListItem>
  {/each}
</div>
