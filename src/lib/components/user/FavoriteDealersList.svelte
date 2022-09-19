<script lang="ts">
  import EmptyContent from "$lib/components/ui/EmptyContent.svelte";
  import HeartIcon from "$lib/components/ui/icons/HeartIcon.svelte";
  import type { Dealer } from "$lib/database/dealer/dealer.model";

  export let dealers: Dealer[] = [];

  async function unfavorite(dealerId: number) {
    const response = await fetch("/api/accounts/favor-dealer/" + dealerId);
    if (response.ok) {
      dealers = await response.json();
    }
  }
</script>

<div class="flex flex-col gap-2 justify-center h-full overflow-auto">
  {#if dealers.length === 0}
    <EmptyContent>Du hast noch keine favorisierten Dealer?!</EmptyContent>
  {/if}
  {#each dealers as dealer}
    <div class="flex justify-between p-3 w-full text-gray-200 bg-teal-500">
      <a href={`/dealer/${dealer.id}`}>{dealer.company_name}</a>
      <div class="cursor-pointer" on:click={() => unfavorite(dealer.id)}>
        <HeartIcon outline />
      </div>
    </div>
  {/each}
</div>
