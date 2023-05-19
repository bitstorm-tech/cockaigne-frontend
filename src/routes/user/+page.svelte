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
  import { centerOfGermany } from "$lib/geo/geo.types";
  import { dealStore } from "$lib/stores/deal.store";
  import { hotDealStore } from "$lib/stores/hot-deal.store";
  import { likeStore } from "$lib/stores/like.store";
  import { getLocation } from "$lib/supabase/location-service";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
  const favoriteDealers = data.favoriteDealers ?? [];
  const account = data.account;
  let showTabIndex = 0;
  let address: string[] = [""];

  onMount(async () => {
    hotDealStore.load().then();
    dealStore.load().then();
    likeStore.load($page.data.supabase).then();
    const supabase = $page.data.supabase;
    const userId = $page.data.userId;
    const location = userId ? await getLocation(supabase, userId) : centerOfGermany;
    const longAddress = await getAddress(location);
    address = addressToShortString(longAddress);
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
