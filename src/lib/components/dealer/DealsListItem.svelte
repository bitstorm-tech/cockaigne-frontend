<script lang="ts">
  import DealListItemDetails from "$lib/components/dealer/DealListItemDetails.svelte";
  import GearIcon from "$lib/components/ui/icons/GearIcon.svelte";
  import { Deal } from "$lib/deal.model";

  export let deal: Deal;
  export let showDetails = false;
  export let isUser = false;
</script>

<div class="flex gap-2 pr-2">
  <div
    class="flex flex-col bg-teal-500 grow rounded-r-xl text-gray-200 text-xl cursor-pointer"
    class:h-14={!showDetails}
  >
    <div class="pl-2" on:click>{deal.title}</div>
    {#if showDetails}
      <DealListItemDetails {deal} {isUser} />
    {/if}
  </div>
  <div class="w-6">
    <GearIcon />
  </div>
</div>
