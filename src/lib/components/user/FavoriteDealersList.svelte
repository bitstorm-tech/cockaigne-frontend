<script lang="ts">
  import { page } from "$app/stores";
  import EmptyContent from "$lib/components/ui/EmptyContent.svelte";
  import { getActiveDealsByDealer } from "$lib/supabase/deal-service";
  import { getFavoriteDealers, toggleFavoriteDealer } from "$lib/supabase/dealer-service";
  import type { ActiveDeal, FavoriteDealer } from "$lib/supabase/public-types";
  import { onMount } from "svelte";
  import HeartIcon from "../ui/icons/HeartIcon.svelte";
  import UserDealsList from "./UserDealsList.svelte";

  let dealers: FavoriteDealer[] = [];
  let deals: ActiveDeal[] = [];

  onMount(async () => {
    const supabase = $page.data.supabase;
    const userId = $page.data.session.user.id;
    dealers = await getFavoriteDealers(supabase, userId);
    const dealerIds = dealers.map((dealer) => dealer.dealer_id!!);
    deals = await getActiveDealsByDealer(supabase, dealerIds);
  });

  async function unfavorite(dealerId: string) {
    await toggleFavoriteDealer($page.data.supabase, $page.data.session.user.id, dealerId);
    dealers = dealers.filter((dealer) => dealer.dealer_id !== dealerId);
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
