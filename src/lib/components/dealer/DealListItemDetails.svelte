<script lang="ts">
  import ThumbUpIcon from "$lib/components/ui/icons/ThumbUpIcon.svelte";
  import type { Deal } from "../../database/deal/deal.model";

  export let isUser = false;
  export let deal: Deal;

  async function like() {
    const response = await fetch("/api/deals/like?id=" + deal.id, { method: "post" });

    if (response.ok) {
      const body = await response.json();
      // deal.likes = body.likes;
    }
  }
</script>

<div class="flex flex-col justify-between h-32 bg-stone-400 rounded-br-xl text-xs p-2">
  {deal.description}
  {#if isUser}
    <div class="flex h-4 justify-between">
      <div class="flex gap-4">
        <div class="flex gap-2" on:click={like}>
          <ThumbUpIcon size="1" />{deal.likes}
        </div>
        <span class="whitespace-nowrap">Deal melden</span>
      </div>
      <a href="/dealer/{deal.account_id}"><span class="whitespace-nowrap">zum Dealer</span></a>
    </div>
  {:else}
    <span class="mt-4 text-2xs">Start: {deal.start} / Dauer: {deal.duration}</span>
  {/if}
</div>
