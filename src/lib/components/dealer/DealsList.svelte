<script lang="ts">
  import DealsListItem from "$lib/components/dealer/DealsListItem.svelte";
  import GearIcon from "$lib/components/ui/icons/GearIcon.svelte";
  import HeartIcon from "$lib/components/ui/icons/HeartIcon.svelte";
  import { Deal } from "$lib/deal.model";

  export let deals: Deal[] = [];
  export let isUser = false;
  let openDetail = -1;
</script>

<div class="flex flex-col gap-4">
  {#each deals as deal, i}
    <DealsListItem
      {deal}
      {isUser}
      showDetails={openDetail === i}
      on:click={() => (openDetail = openDetail === i ? -1 : i)}
    >
      <div>
        {#if isUser}
          <HeartIcon outline />
        {:else}
          <GearIcon />
        {/if}
      </div>
    </DealsListItem>
  {/each}
</div>
