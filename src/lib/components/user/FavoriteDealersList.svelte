<script lang="ts">
  import { page } from "$app/stores";
  import EmptyContent from "$lib/components/ui/EmptyContent.svelte";
  import { getActiveDealsByDealer } from "$lib/supabase/deal-service";
  import { getFavoriteDealers } from "$lib/supabase/dealer-service";
  import type { ActiveDeal, FavoriteDealer } from "$lib/supabase/public-types";
  import { onMount } from "svelte";
  import UserDealsList from "./UserDealsList.svelte";

  let dealers: FavoriteDealer[] = [];
  let deals: ActiveDeal[] = [];

  onMount(async () => {
    const supabase = $page.data.supabase;
    const userId = $page.data.userId;
    if (!userId) return;
    dealers = await getFavoriteDealers(supabase, userId);
    const dealerIds = dealers.map((dealer) => dealer.dealer_id!!);
    deals = await getActiveDealsByDealer(supabase, dealerIds);
  });
</script>

<div class="flex h-full flex-col justify-center gap-2 overflow-auto">
  {#if dealers.length === 0}
    <EmptyContent>
      <p>Du hast noch keine favorisierten Dealer?!</p>
    </EmptyContent>
  {/if}
  {#each dealers as dealer}
    <UserDealsList
      deals={deals.filter((deal) => deal.dealer_id === dealer.dealer_id)}
      showCompanyName={true}
      showHotIcon={false}
      liveUpdate={false}
    />
  {/each}
</div>
