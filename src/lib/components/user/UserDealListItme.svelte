<script lang="ts">
  import DealsListItem from "$lib/components/dealer/DealsListItem.svelte";
  import FireIcon from "$lib/components/ui/icons/FireIcon.svelte";
  import { dealStore } from "$lib/stores/deal.store";
  import type { ActiveDeal } from "$lib/supabase/public-types";

  export let openDetail = false;
  export let showCompanyName = true;
  export let showHotIcon = true;
  export let deal: ActiveDeal;
</script>

<DealsListItem {deal} showDetails={openDetail} {showCompanyName} on:click>
  <button
    slot="right-action"
    class="cursor-pointer"
    on:click={() => dealStore.toggleHot(deal.id)}
    hidden={!showHotIcon}
  >
    <FireIcon outline={!deal.isHot} />
  </button>
</DealsListItem>
