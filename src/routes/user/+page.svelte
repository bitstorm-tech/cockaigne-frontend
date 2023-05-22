<script lang="ts">
  import { page } from "$app/stores";
  import EmptyContent from "$lib/components/ui/EmptyContent.svelte";
  import FireIcon from "$lib/components/ui/icons/FireIcon.svelte";
  import HeartIcon from "$lib/components/ui/icons/HeartIcon.svelte";
  import StarIcon from "$lib/components/ui/icons/StarIcon.svelte";
  import Link from "$lib/components/ui/Link.svelte";
  import FavoriteDealersList from "$lib/components/user/FavoriteDealersList.svelte";
  import UserDealsList from "$lib/components/user/UserDealsList.svelte";
  import UserHeader from "$lib/components/user/UserHeader.svelte";
  import UserHotDealsList from "$lib/components/user/UserHotDealsList.svelte";
  import { addressToShortString, getAddress } from "$lib/geo/address.service";
  import { dealStore } from "$lib/stores/deal.store";
  import { hotDealStore } from "$lib/stores/hot-deal.store";
  import { likeStore } from "$lib/stores/like.store";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";
  import { locationStore } from "$lib/stores/location.store";

  export let data: PageData;
  const favoriteDealers = data.favoriteDealers ?? [];
  const account = data.account;
  let showTabIndex = 0;
  let address: string[] = [""];

  $: {
    getAddress($locationStore).then((longAddress) => {
      address = addressToShortString(longAddress);
    });
  }

  onMount(async () => {
    hotDealStore.load().then();
    dealStore.load().then();
    likeStore.load($page.data.supabase).then();
    locationStore.load($page.data.supabase, $page.data.userId);
  });
</script>

<UserHeader
  name={account?.username}
  {address}
  deals={$dealStore.length}
  imageUrl={data.profileImageUrl}
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
    {#if $page.data.userId}
      <UserHotDealsList />
    {:else}
      <EmptyContent>
        <p>
          <Link href="/registration" underline>Registriere dich kostenlos</Link>
          um dir deine ganz persönliche Liste an heißen Deals zusammen zu stellen! 🔥
        </p>
      </EmptyContent>
    {/if}
  {:else if $page.data.userId}
    <FavoriteDealersList />
  {:else}
    <EmptyContent>
      <p>
        <Link href="/registration" underline>Registriere dich kostenlos</Link>
        um dir alle deine favorisierten Dealer zu speichern! 🤩
      </p>
    </EmptyContent>
  {/if}
</div>
