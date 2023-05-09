<script lang="ts">
  import EmptyContent from "$lib/components/ui/EmptyContent.svelte";
  import { getFavoriteDealers, toggleFavoriteDealer } from "$lib/supabase/dealer-service";
  import type { ActiveDeal, FavoriteDealer } from "$lib/supabase/public-types";
  import type { Supabase } from "$lib/supabase/supabase-client";
  import { onMount } from "svelte";
  import HeartIcon from "../ui/icons/HeartIcon.svelte";
  import UserDealsList from "./UserDealsList.svelte";

  export let supabsae: Supabase;
  export let userId: string | undefined;

  let dealers: FavoriteDealer[] = [];
  let deals: ActiveDeal[] = [];
  let loading = true;

  onMount(async () => {
    if (!userId) return;
    dealers = await getFavoriteDealers(supabsae, userId);
    const dealerIds = dealers.map((dealer) => dealer.dealer_id!!);
    deals = await getActiveDealsByDealer(dealerIds);
    loading = false;
  });

  async function unfavorite(dealerId: string) {
    await toggleFavoriteDealer(dealerId);
    dealers = dealers.filter((dealer) => dealer.dealer_id !== dealerId);
  }

  function getActiveDealsByDealer(dealerIds: string[]): ActiveDeal[] | PromiseLike<ActiveDeal[]> {
    throw new Error("Function not implemented.");
  }
</script>

<div class="flex h-full flex-col justify-center gap-1 overflow-auto">
  {#if dealers.length === 0}
    <EmptyContent>
      <p>Du hast noch keine favorisierten Dealer?!</p>
    </EmptyContent>
  {/if}
  {#each dealers as dealer}
    <a href={`/dealer/${dealer.dealer_id}`} class="flex w-full justify-between bg-[#2c363a] p-3 text-[#b2b2b2]">
      <p>{dealer.username}</p>
      <button class="cursor-pointer" on:click|preventDefault={() => unfavorite(dealer.dealer_id || "")}>
        <HeartIcon />
      </button>
    </a>
    <UserDealsList
      deals={deals.filter((deal) => deal.dealer_id === dealer.dealer_id)}
      showCompanyName={false}
      showHotIcon={false}
      liveUpdate={false}
    />
  {/each}
</div>
