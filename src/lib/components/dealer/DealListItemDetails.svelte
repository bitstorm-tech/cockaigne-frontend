<script lang="ts">
  import ThumbUpIcon from "$lib/components/ui/icons/ThumbUpIcon.svelte";
  import type { Deal } from "$lib/database/deal/deal.model";

  export let isUser = false;
  export let deal: Deal;

  async function like() {
    const response = await fetch("/api/deals/like?id=" + deal.id, { method: "post" });

    if (response.ok) {
      deal.likes = +(await response.text());
    }
  }
</script>

<div class="flex flex-col justify-between bg-[#323e42] text-xs p-2">
  {deal.description}
  <div class="grid grid-cols-3 gap-1 pt-6">
    {#each deal.imageUrls as imageUrl}
      <img src={imageUrl} alt="Deal" />
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
