<script lang="ts">
  import { page } from "$app/stores";
  import Picture from "$lib/components/dealer/pictures/Picture.svelte";
  import ZoomPictureModal from "$lib/components/dealer/pictures/ZoomPictureModal.svelte";
  import ReportDealModal from "$lib/components/dealer/ReportDealModal.svelte";
  import LikeIcon from "$lib/components/ui/icons/LikeIcon.svelte";
  import ReportIcon from "$lib/components/ui/icons/ReportIcon.svelte";
  import { formatDate } from "$lib/date-time.utils.js";
  import { likeStore } from "$lib/stores/like.store";
  import { enrichDealWithImageUrls, toggleLike } from "$lib/supabase/deal-service";
  import type { ActiveDeal } from "$lib/supabase/public-types";
  import { onMount } from "svelte";

  export let deal: ActiveDeal;
  const isUser = !$page.data.isDealer;
  let openZoomModal = false;
  let openReportModal = false;
  let zoomImageIndex = 0;

  $: liked = $likeStore.includes(deal.id!);

  const supabase = $page.data.supabase;
  const userId = $page.data.userId;

  onMount(async () => {
    deal = (await enrichDealWithImageUrls(supabase, [deal]))[0];
  });

  async function like() {
    if (!userId) return;

    likeStore.toggleLike(deal.id!);
    deal.likes = await toggleLike(supabase, userId, deal);
  }

  function onZoom(index: number) {
    zoomImageIndex = index;
    openZoomModal = true;
  }
</script>

<div class="flex flex-col justify-between bg-[#323e42] p-2">
  {deal.description}
  <div class="grid grid-cols-3 gap-1 py-2">
    {#each deal.imageUrls || [] as imageUrl, index}
      <Picture url={imageUrl} smallHeight={true} on:zoom={() => onZoom(index)} />
    {/each}
  </div>
  {#if isUser}
    <span class="py-4 text-xs">Endet am {formatDate(deal.start, +deal.duration * 60)}</span>
    <div class="flex h-6 justify-between">
      <div class="flex items-center gap-3">
        <button on:click={like}>
          <LikeIcon size={1.3} dislike={liked} />
        </button>
        <span class="text-lg">{deal.likes}</span>
      </div>
      <button on:click={() => (openReportModal = true)}>
        <ReportIcon size={1.3} />
      </button>
    </div>
  {:else}
    <div class="flex justify-between text-xs">
      <span>Von: {formatDate(deal.start)}</span>
      <div class="flex items-center gap-1">
        <span>{deal.likes}</span>
        <LikeIcon size={0.8} />
      </div>
      <span>Bis: {formatDate(deal.start, +deal.duration * 60)}</span>
    </div>
  {/if}
</div>
<ZoomPictureModal bind:open={openZoomModal} imageUrls={deal.imageUrls} index={zoomImageIndex} title={deal.title} />
<ReportDealModal bind:open={openReportModal} dealName={deal.title} dealId={deal.id} />
