<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import DealsListItem from "$lib/components/dealer/DealsListItem.svelte";
  import GearIcon from "$lib/components/ui/icons/GearIcon.svelte";
  import HeartIcon from "$lib/components/ui/icons/HeartIcon.svelte";
  import Link from "$lib/components/ui/Link.svelte";
  import type { Deal } from "$lib/database/deal/deal.model";
  import { createEventDispatcher } from "svelte";

  export let deals: Deal[] = [];
  export let favoriteDeals: Deal[] = [];

  const dispatch = createEventDispatcher();
  const isUser = !$page.data.user.isDealer;
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
    <p class="text-opacity-30 text-gray-200 m-auto pt-10 flex flex-col">
      Du hast keine aktiven Deals. Worauf wartest du? <Link href="/deals/new" underline>Deal erstellen!</Link>
    </p>
  {/if}
  {#each deals as deal, i}
    <DealsListItem
      {deal}
      {isUser}
      showDetails={openDetail === i}
      on:click={() => (openDetail = openDetail === i ? -1 : i)}
    >
      {#if isUser}
        <div class="cursor-pointer" on:click={() => favor(deal)}>
          <HeartIcon outline={!isFavorite(deal.id)} />
        </div>
      {:else}
        <div class="cursor-pointer" on:click={() => goto("/deals/" + deal.id.toString())}>
          <GearIcon />
        </div>
      {/if}
    </DealsListItem>
  {/each}
</div>
