<script lang="ts">
  import Picture from "$lib/components/dealer/pictures/Picture.svelte";
  import ZoomPictureModal from "$lib/components/dealer/pictures/ZoomPictureModal.svelte";
  import ReportDealModal from "$lib/components/dealer/ReportDealModal.svelte";
  import LikeIcon from "$lib/components/ui/icons/LikeIcon.svelte";
  import LoadingSpinner from "$lib/components/ui/icons/LoadingSpinner.svelte";
  import ReportIcon from "$lib/components/ui/icons/ReportIcon.svelte";
  import type { Deal } from "$lib/database/deal/deal.model";
  import { formatDate } from "$lib/date-time.utils.js";
  import { likeStore } from "$lib/stores/like.store";

  export let isUser = false;
  export let deal: Deal;
  let openZoomModal = false;
  let openReportModal = false;
  let zoomImageIndex = 0;
  let processingLike = false;

  async function like() {
    processingLike = true;
    const response = await fetch("/api/deals/like?id=" + deal.id);

    if (response.ok) {
      deal.likes = +(await response.text());
      likeStore.toggleLike(deal.id);
    }
    processingLike = false;
  }

  function onZoom(index: number) {
    zoomImageIndex = index;
    openZoomModal = true;
  }
</script>

<div class="flex flex-col justify-between bg-[#323e42] p-2">
  {deal.description}
  <div class="grid grid-cols-3 gap-1 py-6">
    {#each deal.imageUrls as imageUrl, index}
      <Picture url={imageUrl} smallHeight={true} on:zoom={() => onZoom(index)} />
    {/each}
  </div>
  {#if isUser}
    <div class="flex h-6 justify-between">
      <div class="flex items-center gap-3">
        {#if processingLike}
          <LoadingSpinner size="1.5" />
        {:else}
          <button on:click={like}>
            <LikeIcon size="1.5" dislike={$likeStore.includes(deal.id)} />
          </button>
        {/if}
        <span class="text-lg">{deal.likes || "0"}</span>
      </div>
      <button on:click={() => (openReportModal = true)}>
        <ReportIcon size="1.5" />
      </button>
    </div>
  {:else}
    <span class="text-xs">Start: {formatDate(deal.start)}</span>
    <span class="text-xs">Ende: {formatDate(deal.start, +deal.duration * 60)}</span>
  {/if}
</div>
<ZoomPictureModal bind:open={openZoomModal} imageUrls={deal.imageUrls} index={zoomImageIndex} title={deal.title} />
<ReportDealModal bind:open={openReportModal} dealName={deal.title} dealId={deal.id} />
