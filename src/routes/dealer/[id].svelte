<script lang="ts" context="module">
  import type { LoadEvent } from "@sveltejs/kit";

  export async function load({ fetch }: LoadEvent) {
    const response = await fetch("/api/deals");
    const responsePictures = await fetch("/api/pictures");

    if (response.ok && responsePictures.ok) {
      const deals = await response.json();
      const pictures = await responsePictures.json();
      return {
        props: {
          deals,
          pictures
        }
      };
    }
  }
</script>

<script lang="ts">
  import DealsList from "$lib/components/dealer/DealsList.svelte";
  import Pictures from "$lib/components/dealer/Pictures.svelte";
  import RatingsList from "$lib/components/dealer/RatingsList.svelte";
  import ProfileHeader from "$lib/components/profile/ProfileHeader.svelte";
  import FireIcon from "$lib/components/ui/icons/FireIcon.svelte";
  import PhotoIcon from "$lib/components/ui/icons/PhotoIcon.svelte";
  import StarIcon from "$lib/components/ui/icons/StarIcon.svelte";
  import type { Deal } from "$lib/database/deal/deal.model";

  let activeTab = 0;
  export let deals: Deal[] = [];
  export let pictures: string[] = [];
</script>

<ProfileHeader
  name="Aakenus Grill"
  street="Bahnhofstr. 22"
  city="10123 Berlin"
  imageUrl="/images/dummy/aakenus-grill-profile.svg"
  actionUrl="/deals/overview"
/>
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
  <DealsList {deals} />
{:else if activeTab === 1}
  <Pictures {pictures} />
{:else}
  <RatingsList />
{/if}
