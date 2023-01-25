<script lang="ts">
  import DealsListItem from "$lib/components/dealer/DealsListItem.svelte";
  import FireIcon from "$lib/components/ui/icons/FireIcon.svelte";
  import type { Deal } from "$lib/database/deal/deal.model";
  import { hotStore } from "$lib/stores/hot.store.js";

  export let openDetail = false;
  export let showCompanyName = true;
  export let deal: Deal;
</script>

<DealsListItem {deal} showDetails={openDetail} {showCompanyName} on:click>
  <button slot="right-action" class="cursor-pointer" on:click={() => hotStore.toggleHotDeal(deal.id)}>
    <FireIcon outline={!$hotStore.includes(deal.id)} />
  </button>
</DealsListItem>
