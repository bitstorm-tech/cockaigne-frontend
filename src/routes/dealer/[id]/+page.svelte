<script lang="ts">
  import { page } from "$app/stores";
  import DealsList from "$lib/components/dealer/DealsList.svelte";
  import RatingsList from "$lib/components/dealer/RatingsList.svelte";
  import Pictures from "$lib/components/dealer/pictures/Pictures.svelte";
  import ProfileHeader from "$lib/components/profile/ProfileHeader.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import AddDealIcon from "$lib/components/ui/icons/AddDealIcon.svelte";
  import DealIcon from "$lib/components/ui/icons/DealIcon.svelte";
  import HeartIcon from "$lib/components/ui/icons/HeartIcon.svelte";
  import LoadingSpinner from "$lib/components/ui/icons/LoadingSpinner.svelte";
  import PhotoIcon from "$lib/components/ui/icons/PhotoIcon.svelte";
  import RatingIcon from "$lib/components/ui/icons/RatingIcon.svelte";
  import { toggleFavoriteDealer } from "$lib/supabase/dealer-service";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
  let activeTab = 0;
  const { dealerId, deals, account, profileImage, pictures } = data;
  const supabase = $page.data.supabase;
  const userId = $page.data.userId;
  let isFavoriteDealer = data.isFavDealer;
  let loadingFavorite = false;

  onMount(() => {
    deals?.sort((a, b) => (a.start?.localeCompare(b.start || "") || 0) * -1);
  });

  async function toggleFavor() {
    if (!dealerId || !userId) return;
    isFavoriteDealer = !isFavoriteDealer;
    await toggleFavoriteDealer(supabase, userId, dealerId);
  }
</script>

<ProfileHeader
  name={account.username}
  street={`${account.street} ${account.house_number}`}
  city={`${account.zip} ${account.city}`}
  phone={account?.phone}
  imageUrl={profileImage}
  category={account.category}
>
  {#if $page.data.isDealer}
    <a href={"/deals/new?dealerId=" + dealerId}>
      <Button warning rightFlat additionalWidth><AddDealIcon size={4} /></Button>
    </a>
  {:else}
    <Button on:click={toggleFavor} circle warning rightFlat additionalWidth>
      {#if loadingFavorite}
        <LoadingSpinner />
      {:else}
        <HeartIcon outline={!isFavoriteDealer} />
      {/if}
    </Button>
  {/if}
</ProfileHeader>
<div class="mb-1 mt-4 grid grid-cols-3">
  <button class="tab tab-bordered" class:tab-active={activeTab === 0} on:click={() => (activeTab = 0)}>
    <DealIcon size={1.4} outline={activeTab !== 0} />
  </button>
  <button class="tab tab-bordered" class:tab-active={activeTab === 1} on:click={() => (activeTab = 1)}>
    <PhotoIcon outline={activeTab !== 1} />
  </button>
  <button class="tab tab-bordered" class:tab-active={activeTab === 2} on:click={() => (activeTab = 2)}>
    <RatingIcon size={1.4} outline={activeTab !== 2} />
  </button>
</div>
{#if activeTab === 0}
  <DealsList {deals} />
{:else if activeTab === 1}
  <Pictures {pictures} companyName={account.username} />
{:else}
  <RatingsList {dealerId} userId={$page.data.userId} isDealer={$page.data.isDealer} />
{/if}
