<script lang="ts">
  import FireIcon from "$lib/components/ui/icons/FireIcon.svelte";
  import HeartIcon from "$lib/components/ui/icons/HeartIcon.svelte";
  import StarIcon from "$lib/components/ui/icons/StarIcon.svelte";
  import FavoriteDealersList from "$lib/components/user/FavoriteDealersList.svelte";
  import UserDealsList from "$lib/components/user/UserDealsList.svelte";
  import UserFavoriteDealsList from "$lib/components/user/UserFavoriteDealsList.svelte";
  import UserHeader from "$lib/components/user/UserHeader.svelte";
  import type { Deal } from "$lib/database/deal/deal.model";
  import type { Dealer } from "$lib/database/dealer/dealer.model";
  import { sortDealsByState } from "$lib/deal.service";
  import _ from "lodash";

  export let data;
  let deals: Deal[] = data?.deals;
  let favoriteDeals: Deal[] = data?.favoriteDeals;
  let favoriteDealers: Dealer[] = data?.favoriteDealers;
  let showTabIndex = 0;

  $: activeDeals = sortDealsByState(deals).active;

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

<UserHeader
  name="Jane Doe"
  street="Oxford Way"
  city="Beverly Hills, Los Angeles"
  imageUrl="/images/dummy/user-profile.svg"
/>
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
    <UserDealsList deals={activeDeals} {favoriteDeals} on:favor={toggleFavorite} />
  </div>
{:else if showTabIndex === 1}
  <div class="h-full overflow-auto">
    <UserFavoriteDealsList {favoriteDeals} on:disfavor={toggleFavorite} />
  </div>
{:else}
  <FavoriteDealersList dealers={favoriteDealers} />
{/if}
