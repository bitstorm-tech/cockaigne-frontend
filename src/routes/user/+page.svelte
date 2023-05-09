<script lang="ts">
  import FireIcon from "$lib/components/ui/icons/FireIcon.svelte";
  import HeartIcon from "$lib/components/ui/icons/HeartIcon.svelte";
  import StarIcon from "$lib/components/ui/icons/StarIcon.svelte";
  import FavoriteDealersList from "$lib/components/user/FavoriteDealersList.svelte";
  import UserDealsList from "$lib/components/user/UserDealsList.svelte";
  import UserHeader from "$lib/components/user/UserHeader.svelte";
  import UserHotDealsList from "$lib/components/user/UserHotDealsList.svelte";
  import { addressToShortString, getAddress } from "$lib/geo/address.service";
  import { dealStore } from "$lib/stores/deal.store";
  import { hotDealStore } from "$lib/stores/hot-deal.store";
  import { likeStore } from "$lib/stores/like.store";
  import locationService from "$lib/supabase/location-service";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
  const favoriteDealers = data.favoriteDealers ?? [];
  const account = data.account;
  let showTabIndex = 0;
  let address: string[] = [""];

  onMount(async () => {
    hotDealStore.load();
    dealStore.load();
    likeStore.load();
    const location = await locationService.getLocation();
    const longAddress = await getAddress(location);
    address = addressToShortString(longAddress);
  });
</script>

<UserHeader
  name={account?.username}
  {address}
  deals={$dealStore.length}
  imageUrl={account?.profileImageUrl}
  favoriteDealers={favoriteDealers?.length}
  hotDeals={$dealStore.filter((deal) => deal.isHot).length}
/>
<div class="tabs mb-1 mt-6 flex max-h-8">
  <button on:click={() => (showTabIndex = 0)} class="tab-bordered tab grow" class:tab-active={showTabIndex === 0}>
    <StarIcon outline={showTabIndex !== 0} />
  </button>
  <button on:click={() => (showTabIndex = 1)} class="tab-bordered tab grow" class:tab-active={showTabIndex === 1}>
    <FireIcon outline={showTabIndex !== 1} />
  </button>
  <button on:click={() => (showTabIndex = 2)} class="tab-bordered tab grow" class:tab-active={showTabIndex === 2}>
    <HeartIcon outline={showTabIndex !== 2} />
  </button>
</div>
<div class="h-full overflow-auto">
  {#if showTabIndex === 0}
    <UserDealsList />
  {:else if showTabIndex === 1}
    <UserHotDealsList />
  {:else}
    <FavoriteDealersList supabsae={data.supabase} userId={data.account?.id} />
  {/if}
</div>
