<script lang="ts">
  import Picture from "$lib/components/dealer/pictures/Picture.svelte";
  import ZoomPictureModal from "$lib/components/dealer/pictures/ZoomPictureModal.svelte";
  import ThumbUpIcon from "$lib/components/ui/icons/ThumbUpIcon.svelte";
  import type { Deal } from "$lib/database/deal/deal.model";

  export let isUser = false;
  export let deal: Deal;
  let openZoomModal = false;
  let zoomImageIndex = 0;

  async function like() {
    const response = await fetch("/api/deals/like?id=" + deal.id, { method: "post" });

    if (response.ok) {
      deal.likes = +(await response.text());
    }
  }

  function onZoom(index: number) {
    zoomImageIndex = index;
    openZoomModal = true;
  }
</script>

<div class="flex flex-col justify-between bg-[#323e42] text-xs p-2">
  {deal.description}
  <div class="grid grid-cols-3 gap-1 py-6">
    {#each deal.imageUrls as imageUrl, index}
      <Picture url={imageUrl} smallHeight={true} showZoom={true} on:zoom={() => onZoom(index)} />
    {/each}
  </div>
  {#if isUser}
    <div class="flex h-4 justify-between">
      <div class="flex gap-4">
        <button class="flex gap-2" on:click={like}>
          <ThumbUpIcon size="1" />
        </button>
      </div>
    </div>
  {:else}
    <span class="mt-4 text-2xs">Start: {deal.start} / Dauer: {deal.duration} Stunden</span>
  {/if}
</div>
<ZoomPictureModal bind:open={openZoomModal} imageUrls={deal.imageUrls} index={zoomImageIndex} title={deal.title} />
