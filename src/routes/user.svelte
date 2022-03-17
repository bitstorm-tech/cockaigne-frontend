<script lang="ts">
  import DealsList from "$lib/components/deals/DealsList.svelte";
  import FavoritesList from "$lib/components/favorites/FavoritesList.svelte";
  import HotList from "$lib/components/hot/HotList.svelte";
  import FireIcon from "$lib/components/ui/icons/FireIcon.svelte";
  import HeartIcon from "$lib/components/ui/icons/HeartIcon.svelte";
  import StarIcon from "$lib/components/ui/icons/StarIcon.svelte";

  let showTabIndex = 0;
</script>

<div class="tabs mt-6 max-h-8">
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
  <DealsList />
{:else if showTabIndex === 1}
  <FavoritesList />
{:else}
  <HotList />
{/if}
