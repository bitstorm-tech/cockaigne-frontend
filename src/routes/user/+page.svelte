<script lang="ts">
  import FireIcon from "$lib/components/ui/icons/FireIcon.svelte";
  import HeartIcon from "$lib/components/ui/icons/HeartIcon.svelte";
  import StarIcon from "$lib/components/ui/icons/StarIcon.svelte";
  import FavoriteDealersList from "$lib/components/user/FavoriteDealersList.svelte";
  import UserDealsList from "$lib/components/user/UserDealsList.svelte";
  import UserHeader from "$lib/components/user/UserHeader.svelte";
  import UserHotDealsList from "$lib/components/user/UserHotDealsList.svelte";
  import type { Account } from "$lib/database/account/account.model";
  import type { Deal } from "$lib/database/deal/deal.model";
  import type { Dealer } from "$lib/database/dealer/dealer.model";
  import { sortDealsByTime } from "$lib/deal.utils";
  import { addressToShortString, getAddress } from "$lib/geo/address.service";
  import { locationStore, searchRadiusStore } from "$lib/store.service";
  import { selectedCategoriesStore } from "$lib/stores/category.store";
  import { dealStore } from "$lib/stores/deal.store";
  import { hotStore } from "$lib/stores/hot.store";
  import { likeStore } from "$lib/stores/like.store";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
  const favoriteDealers: Dealer[] = data.favoriteDealers;
  const favoriteDealerDeals: Deal[] = data.favoriteDealerDeals;
  const account: Account = data.account;
  let showTabIndex = 0;
  let address = "";

  onMount(async () => {
    likeStore.load().then();
    hotStore.load().then();
    dealStore.load($locationStore, $searchRadiusStore / 2, $selectedCategoriesStore).then();
    const longAddress = await getAddress($locationStore);
    address = addressToShortString(longAddress);
  });
</script>

<UserHeader
  name={account.username}
  {address}
  deals={$dealStore.length}
  imageUrl={account.profile_image}
  favoriteDealers={favoriteDealers?.length}
  hotDeals={$hotStore.length}
/>
<div class="tabs mt-6 mb-2 max-h-8">
  <button on:click={() => (showTabIndex = 0)} class="tab tab-bordered grow" class:tab-active={showTabIndex === 0}>
    <StarIcon outline={showTabIndex !== 0} />
  </button>
  <button on:click={() => (showTabIndex = 1)} class="tab tab-bordered grow" class:tab-active={showTabIndex === 1}>
    <FireIcon outline={showTabIndex !== 1} />
  </button>
  <button on:click={() => (showTabIndex = 2)} class="tab tab-bordered grow" class:tab-active={showTabIndex === 2}>
    <HeartIcon outline={showTabIndex !== 2} />
  </button>
</div>
<div class="h-full overflow-auto">
  {#if showTabIndex === 0}
    <UserDealsList deals={sortDealsByTime($dealStore)} />
  {:else if showTabIndex === 1}
    <UserHotDealsList />
  {:else}
    <FavoriteDealersList dealers={favoriteDealers} deals={favoriteDealerDeals} />
  {/if}
</div>
