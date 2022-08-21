<script lang="ts">
  import DealsList from "$lib/components/dealer/DealsList.svelte";
  import Pictures from "$lib/components/dealer/pictures/Pictures.svelte";
  import RatingsList from "$lib/components/dealer/RatingsList.svelte";
  import ProfileHeader from "$lib/components/profile/ProfileHeader.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import FireIcon from "$lib/components/ui/icons/FireIcon.svelte";
  import PhotoIcon from "$lib/components/ui/icons/PhotoIcon.svelte";
  import StarIcon from "$lib/components/ui/icons/StarIcon.svelte";
  import { sortDealsByState } from "$lib/deal.service";
  import type { Deal } from "../../../lib/database/deal/deal.model";

  export let data;
  let activeTab = 0;
  const deals: Deal[] = data.deals;
  const pictures: string[] = data.pictures;

  $: activeDeals = sortDealsByState(deals).active;
</script>

<ProfileHeader
  name="Aakenus Grill"
  street="Bahnhofstr. 22"
  city="10123 Berlin"
  imageUrl="/images/dummy/aakenus-grill-profile.svg"
>
  <a href="/deals/overview">
    <Button outline circle>
      <FireIcon />
    </Button>
  </a>
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
  <RatingsList />
{/if}
