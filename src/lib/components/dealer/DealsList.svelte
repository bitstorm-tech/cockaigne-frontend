<script lang="ts">
  import DealsListItem from "$lib/components/dealer/DealsListItem.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import { Deal } from "$lib/deal.model";

  export let deals: Deal[] = [];
</script>

<div class="flex flex-col gap-4 overflow-scroll h-full">
  <div class="w-full px-2">
    <Button href="/create-deal" small>Neuen Deal erstellen</Button>
  </div>
  {#each deals as deal}
    <DealsListItem {deal} />
  {/each}
</div>
