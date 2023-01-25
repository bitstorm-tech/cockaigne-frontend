<script lang="ts">
  import EmptyContent from "$lib/components/ui/EmptyContent.svelte";
  import HeartIcon from "$lib/components/ui/icons/HeartIcon.svelte";
  import type { Deal } from "$lib/database/deal/deal.model";
  import type { Dealer } from "$lib/database/dealer/dealer.model";
  import UserDealsList from "./UserDealsList.svelte";

  export let dealers: Dealer[] = [];
  export let deals: Deal[] = [];

  async function unfavorite(dealerId: number) {
    const response = await fetch("/api/accounts/favor-dealer/" + dealerId);
    if (response.ok) {
      dealers = await response.json();
    }
  }
</script>

<div class="flex flex-col gap-2 justify-center h-full overflow-auto">
  {#if dealers.length === 0}
    <EmptyContent>
      <p>Du hast noch keine favorisierten Dealer?!</p>
    </EmptyContent>
  {/if}
  {#each dealers as dealer}
    <a href={`/dealer/${dealer.id}`} class="flex justify-between p-3 w-full bg-[#2c363a] text-[#b2b2b2] mb-2">
      <p>{dealer.company_name}</p>
      <button class="cursor-pointer" on:click|preventDefault={() => unfavorite(dealer.id)}>
        <HeartIcon />
      </button>
    </a>
    <UserDealsList deals={deals.filter((deal) => deal.dealer_id === dealer.id)} showCompanyName={false} />
  {/each}
</div>
