<script lang="ts">
  import EmptyContent from "$lib/components/ui/EmptyContent.svelte";
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
    <UserDealsList deals={deals.filter((deal) => deal.dealer_id === dealer.id)} />
  {/each}
</div>
