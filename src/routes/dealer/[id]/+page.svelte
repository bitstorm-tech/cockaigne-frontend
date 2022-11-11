<script lang="ts">
  import { page } from "$app/stores";
  import DealsList from "$lib/components/dealer/DealsList.svelte";
  import Pictures from "$lib/components/dealer/pictures/Pictures.svelte";
  import RatingsList from "$lib/components/dealer/RatingsList.svelte";
  import ProfileHeader from "$lib/components/profile/ProfileHeader.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import FireIcon from "$lib/components/ui/icons/FireIcon.svelte";
  import HeartIcon from "$lib/components/ui/icons/HeartIcon.svelte";
  import LoadingSpinner from "$lib/components/ui/icons/LoadingSpinner.svelte";
  import PhotoIcon from "$lib/components/ui/icons/PhotoIcon.svelte";
  import StarIcon from "$lib/components/ui/icons/StarIcon.svelte";
  import type { Deal } from "$lib/database/deal/deal.model";
  import { sortDealsByState } from "$lib/deal.service";
  import type { Account } from "$lib/database/account/account.model";

  export let data;
  let activeTab = 0;
  const dealerId = +data?.dealerId;
  const deals: Deal[] = data?.deals;
  const account: Account = data?.account;
  const pictures: string[] = data?.pictures;
  let favoriteDealers: number[] = data?.favoriteDealers;
  let loadingFavorite = false;

  $: isFavoriteDealer = favoriteDealers.indexOf(dealerId) >= 0;
  $: activeDeals = sortDealsByState(deals).active;

  async function toggleFavor() {
    loadingFavorite = true;
    const response = await fetch(`/api/accounts/favor-dealer/${dealerId}`);
    if (response.ok) {
      const favoriteDealersJson = await response.json();
      favoriteDealers = favoriteDealersJson.map((dealer) => dealer.id);
    }
    loadingFavorite = false;
  }
</script>

<ProfileHeader
  name={account.company_name}
  street={`${account.street} ${account.house_number}`}
  city={`${account.zip} ${account.city}`}
  imageUrl="/images/anonym-profile-dealer.png"
>
  {#if $page.data.user.isDealer}
    <a href={"/deals/overview/" + dealerId}>
      <Button outline circle>
        <FireIcon />
      </Button>
    </a>
  {:else}
    <Button on:click={toggleFavor} circle>
      {#if loadingFavorite}
        <LoadingSpinner />
      {:else}
        <HeartIcon outline={!isFavoriteDealer} />
      {/if}
    </Button>
  {/if}
</ProfileHeader>

<div class="grid grid-cols-3 mt-4 mb-2">
  <div class="tab tab-bordered" class:tab-active={activeTab === 0} on:click={() => (activeTab = 0)}>
    <FireIcon />
  </div>
  <div class="tab tab-bordered" class:tab-active={activeTab === 1} on:click={() => (activeTab = 1)}>
    <PhotoIcon />
  </div>
  <div class="tab tab-bordered" class:tab-active={activeTab === 2} on:click={() => (activeTab = 2)}>
    <StarIcon />
  </div>
</div>
{#if activeTab === 0}
  <DealsList deals={activeDeals} />
{:else if activeTab === 1}
  <Pictures {pictures} />
{:else}
  <RatingsList {dealerId} userId={$page.data.user.id} isDealer={$page.data.user.isDealer} />
{/if}
