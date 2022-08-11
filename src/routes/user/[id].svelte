<script lang="ts" context="module">
  import type { LoadEvent } from "@sveltejs/kit";

  export async function load({ fetch, session }: LoadEvent) {
    if (!session.isAuthenticated) {
      return {
        status: 301,
        redirect: "/"
      };
    }

    let response = await fetch("/api/deals");
    const deals = await response.json();
    response = await fetch("/api/accounts/");
    const account = await response.json();
    response = await fetch("/api/favorites");
    const favoriteDeals = await response.json();

    if (response.ok) {
      return {
        props: {
          deals,
          favoriteDeals,
          account
        }
      };
    }
  }
</script>

<script lang="ts">
  import HotList from "$lib/components/hot/HotList.svelte";
  import FireIcon from "$lib/components/ui/icons/FireIcon.svelte";
  import HeartIcon from "$lib/components/ui/icons/HeartIcon.svelte";
  import StarIcon from "$lib/components/ui/icons/StarIcon.svelte";
  import type { Deal } from "$lib/database/deal/deal.model";
  import _ from "lodash";
  import UserFavoriteDealsList from "$lib/components/user/UserFavoriteDealsList.svelte";
  import { sortDealsByState } from "$lib/deal.service";
  import UserDealsList from "$lib/components/user/UserDealsList.svelte";
  import UserHeader from "$lib/components/user/UserHeader.svelte";

  export let deals: Deal[] = [];
  export let favoriteDeals: Deal[] = [];
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
  <HotList />
{/if}
