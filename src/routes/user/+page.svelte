<script lang="ts">
  import FireIcon from "$lib/components/ui/icons/FireIcon.svelte";
  import HeartIcon from "$lib/components/ui/icons/HeartIcon.svelte";
  import StarIcon from "$lib/components/ui/icons/StarIcon.svelte";
  import FavoriteDealersList from "$lib/components/user/FavoriteDealersList.svelte";
  import UserDealsList from "$lib/components/user/UserDealsList.svelte";
  import UserFavoriteDealsList from "$lib/components/user/UserFavoriteDealsList.svelte";
  import UserHeader from "$lib/components/user/UserHeader.svelte";
  import type { Account } from "$lib/database/account/account.model";
  import type { Deal } from "$lib/database/deal/deal.model";
  import type { Dealer } from "$lib/database/dealer/dealer.model";
  import { addressToShortString, getAddress } from "$lib/geo/address.service";
  import _ from "lodash";
  import { onMount } from "svelte";
  import { locationStore, searchRadiusStore } from "../../lib/store.service";
  import { dealStore } from "../../lib/database/deal/deal.store";

  export let data;
  let deals: Deal[] = data?.deals;
  let favoriteDeals: Deal[] = data?.favoriteDeals;
  let favoriteDealers: Dealer[] = data?.favoriteDealers;
  let account: Account = data?.account;
  let showTabIndex = 0;
  let address = "";

  onMount(async () => {
    address = addressToShortString(await getAddress($locationStore));
    await dealsStore.filterDeals($locationStore, $searchRadiusStore / 2);
  });

  function toggleFavorite(event: CustomEvent<Deal>) {
    const deal: Deal = event.detail;
    const favoriteDealIndex = favoriteDeals.findIndex((fav) => fav.id === deal.id);
    fetch("/api/favorites", {
      method: favoriteDealIndex >= 0 ? "delete" : "post",
      body: `${deal.id}`
    });

    if (favoriteDealIndex >= 0) {
      _.remove(favoriteDeals, (fav) => fav.id === deal.id);
      favoriteDeals = [...favoriteDeals];
    } else {
      favoriteDeals = [...favoriteDeals, deal];
    }

    deals = [...deals];
  }
</script>

<UserHeader name={account.email} {address} imageUrl="/images/dummy/user-profile.svg" />
<div class="tabs mt-6 max-h-8 mb-2">
  <button on:click={() => (showTabIndex = 0)} class="tab tab-bordered grow" class:tab-active={showTabIndex === 0}>
    <StarIcon />
  </button>
  <button on:click={() => (showTabIndex = 1)} class="tab tab-bordered grow" class:tab-active={showTabIndex === 1}>
    <HeartIcon />
  </button>
  <button on:click={() => (showTabIndex = 2)} class="tab tab-bordered grow" class:tab-active={showTabIndex === 2}>
    <FireIcon />
  </button>
</div>
{#if showTabIndex === 0}
  <div class="h-full overflow-auto">
    <UserDealsList deals={$dealStore} {favoriteDeals} on:favor={toggleFavorite} />
  </div>
{:else if showTabIndex === 1}
  <div class="h-full overflow-auto">
    <UserFavoriteDealsList {favoriteDeals} on:disfavor={toggleFavorite} />
  </div>
{:else}
  <FavoriteDealersList dealers={favoriteDealers} />
{/if}
