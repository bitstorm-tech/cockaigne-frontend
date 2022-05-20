<script lang="ts">
  import { goto } from "$app/navigation";
  import { session } from "$app/stores";
  import DealsListItem from "$lib/components/dealer/DealsListItem.svelte";
  import GearIcon from "$lib/components/ui/icons/GearIcon.svelte";
  import HeartIcon from "$lib/components/ui/icons/HeartIcon.svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let deals = [];
  export let favoriteDeals: string[] = [];
  const isUser = !$session.isDealer;
  let openDetail = -1;

  function favor(deal) {
    dispatch("favor", deal.id.toString());
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
          <HeartIcon outline={!favoriteDeals.includes(deal.id.toString())} on:click={() => favor(deal)} />
        {:else}
          <GearIcon on:click={() => goto("/deals/" + deal.id.toString())} />
        {/if}
      </div>
    </DealsListItem>
  {/each}
</div>
