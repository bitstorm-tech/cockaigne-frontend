<script lang="ts">
  import DealsListItem from "$lib/components/dealer/DealsListItem.svelte";
  import FireIcon from "$lib/components/ui/icons/FireIcon.svelte";
  import { hotStore } from "$lib/stores/hot.store.js";
  import type { ActiveDeal } from "$lib/supabase/public-types";

  export let openDetail = false;
  export let showCompanyName = true;
  export let deal: ActiveDeal;
</script>

<DealsListItem {deal} showDetails={openDetail} {showCompanyName} on:click>
  <button slot="right-action" class="cursor-pointer" on:click={() => hotStore.toggleHotDeal(deal.id)}>
    <FireIcon outline={!$hotStore.includes(deal.id)} />
  </button>
</DealsListItem>
