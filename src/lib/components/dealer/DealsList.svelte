<script lang="ts">
  import DealsListItem from "$lib/components/dealer/DealsListItem.svelte";
  import { Deal } from "$lib/deal.model";

  export let deals: Deal[] = [];
  let openDetail = -1;
</script>

<div class="flex flex-col gap-4">
  {#each deals as deal, i}
    <DealsListItem {deal} showDetails={openDetail === i} on:click={() => (openDetail = openDetail === i ? -1 : i)} />
  {/each}
</div>
