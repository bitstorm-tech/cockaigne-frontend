<script lang="ts">
  import { page } from "$app/stores";
  import DealsList from "$lib/components/dealer/DealsList.svelte";
  import Pictures from "$lib/components/dealer/pictures/Pictures.svelte";
  import RatingsList from "$lib/components/dealer/RatingsList.svelte";
  import ProfileHeader from "$lib/components/profile/ProfileHeader.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import DealIcon from "$lib/components/ui/icons/DealIcon.svelte";
  import HeartIcon from "$lib/components/ui/icons/HeartIcon.svelte";
  import LoadingSpinner from "$lib/components/ui/icons/LoadingSpinner.svelte";
  import PhotoIcon from "$lib/components/ui/icons/PhotoIcon.svelte";
  import RatingIcon from "$lib/components/ui/icons/RatingIcon.svelte";
  import { sortDealsByState } from "$lib/deal.utils";
  import type { PageData } from "./$types";

  export let data: PageData;
  let activeTab = 0;
  const dealerId = data?.dealerId;
  const deals = data?.deals;
  const account = data?.account;
  const profileImage = data.profileImage;
  const pictures = data?.pictures;
  let favoriteDealers = data?.favoriteDealers;
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
  name={account.username}
  street={`${account.street} ${account.house_number}`}
  city={`${account.zip} ${account.city}`}
  imageUrl={profileImage}
>
  {#if $page.data.user.isDealer}
    <a href={"/deals/new?dealerId=" + dealerId} class="mt-4">
      <Button warning>Neuer<br />Deal</Button>
    </a>
  {:else}
    <Button on:click={toggleFavor} circle warning>
      {#if loadingFavorite}
        <LoadingSpinner />
      {:else}
        <HeartIcon outline={!isFavoriteDealer} />
      {/if}
    </Button>
  {/if}
</ProfileHeader>

<div class="mt-4 mb-2 grid grid-cols-3">
  <button class="tab tab-bordered" class:tab-active={activeTab === 0} on:click={() => (activeTab = 0)}>
    <DealIcon />
  </button>
  <button class="tab tab-bordered" class:tab-active={activeTab === 1} on:click={() => (activeTab = 1)}>
    <PhotoIcon />
  </button>
  <button class="tab tab-bordered" class:tab-active={activeTab === 2} on:click={() => (activeTab = 2)}>
    <RatingIcon />
  </button>
</div>
{#if activeTab === 0}
  <DealsList deals={activeDeals} />
{:else if activeTab === 1}
  <Pictures {pictures} companyName={account.username} />
{:else}
  <RatingsList {dealerId} userId={$page.data.user.id} isDealer={$page.data.user.isDealer} />
{/if}
