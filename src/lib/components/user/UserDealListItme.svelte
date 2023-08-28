<script lang="ts">
  import DealsListItem from '$lib/components/dealer/DealsListItem.svelte';
  import BookmarkIcon from '$lib/components/ui/icons/BookmarkIcon.svelte';
  import { hotDealStore } from '$lib/stores/hot-deal.store';
  import type { ActiveDeal } from '$lib/supabase/public-types';

  export let openDetail = false;
  export let showCompanyName = true;
  export let showHotIcon = true;
  export let deal: ActiveDeal;
</script>

<DealsListItem {deal} showDetails={openDetail} {showCompanyName} on:click>
  <button
    slot="right-action"
    class="cursor-pointer"
    on:click={() => hotDealStore.toggleHot(deal.id)}
    hidden={!showHotIcon}
  >
    <BookmarkIcon outline={!deal.isHot} />
  </button>
</DealsListItem>
