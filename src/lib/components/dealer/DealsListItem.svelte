<script lang="ts">
  import GearIcon from "$lib/components/ui/icons/GearIcon.svelte";
  import { Deal } from "$lib/deal.model";

  export let deal: Deal;

  let showDetails = false;
</script>

<div class="flex gap-2 pr-2">
  <div
    class="flex flex-col bg-teal-500 grow rounded-r-xl justify-around text-center text-gray-200 text-xl cursor-pointer"
    class:h-14={!showDetails}
    on:click={() => (showDetails = !showDetails)}
  >
    {deal.title}
    {#if showDetails}
      <div class="h-32 bg-stone-400 rounded-br-xl text-xs p-2">
        {deal.description}
        <span class="mt-4 text-2xs">{deal.startDate}</span>
      </div>
    {/if}
  </div>
  <div class="w-6">
    <GearIcon />
  </div>
</div>
