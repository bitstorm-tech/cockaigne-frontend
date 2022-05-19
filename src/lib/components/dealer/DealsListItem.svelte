<script lang="ts">
  import DealListItemDetails from "$lib/components/dealer/DealListItemDetails.svelte";
  import type { Deal } from "$lib/deal.model";

  export let deal: Deal;
  export let showDetails = false;
  export let isUser = false;
</script>

<div class="flex gap-2 pr-2 items-center">
  <div class="flex flex-col bg-teal-500 grow rounded-r-xl text-gray-200 cursor-pointer" class:h-12={!showDetails}>
    <div class="flex px-2 h-full items-center" on:click>{deal.title}</div>
    {#if showDetails}
      <DealListItemDetails {deal} {isUser} />
    {/if}
  </div>
  <slot />
</div>
