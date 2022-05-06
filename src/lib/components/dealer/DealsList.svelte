<script lang="ts">
  import { session } from "$app/stores";
  import DealsListItem from "$lib/components/dealer/DealsListItem.svelte";
  import GearIcon from "$lib/components/ui/icons/GearIcon.svelte";
  import HeartIcon from "$lib/components/ui/icons/HeartIcon.svelte";
  import { Deal } from "$lib/deal.model";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let deals: Deal[] = [];
  export let favoriteDeals: string[] = [];
  const isUser = !$session.isDealer;
  let openDetail = -1;

  function favor(deal: Deal) {
    dispatch("favor", deal._id.toString());
  }
</script>

<div class="flex flex-col gap-4">
  {#each deals as deal, i}
    <DealsListItem
      {deal}
      {isUser}
      showDetails={openDetail === i}
      on:click={() => (openDetail = openDetail === i ? -1 : i)}
    >
      <div class="cursor-pointer">
        {#if isUser}
          <HeartIcon outline={!favoriteDeals.includes(deal._id.toString())} on:click={() => favor(deal)} />
        {:else}
          <GearIcon />
        {/if}
      </div>
    </DealsListItem>
  {/each}
</div>
