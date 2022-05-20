<script lang="ts" context="module">
  export async function load({ fetch }) {
    let response = await fetch("/api/deals?all=true");
    const deals = await response.json();
    response = await fetch("/api/accounts/");
    const account = await response.json();
    const favoriteDeals = deals.filter(
      (deal) =>
        // account.favorites.some((favorite) => favorite.toString() === deal._id.toString())
        true
    );

    if (response)
      if (response.ok) {
        return {
          props: {
            deals,
            favoriteDeals,
            account
          }
        };
      }
  }
</script>

<script lang="ts">
  import DealsList from "$lib/components/dealer/DealsList.svelte";
  import FavoritesList from "$lib/components/favorites/FavoritesList.svelte";
  import HotList from "$lib/components/hot/HotList.svelte";
  import ProfileHeader from "$lib/components/profile/ProfileHeader.svelte";
  import FireIcon from "$lib/components/ui/icons/FireIcon.svelte";
  import HeartIcon from "$lib/components/ui/icons/HeartIcon.svelte";
  import StarIcon from "$lib/components/ui/icons/StarIcon.svelte";

  export let deals = [];
  export let favoriteDeals = [];
  export let account;
  let showTabIndex = 0;

  function favor(event) {
    const dealId = event.detail;
    fetch("/api/accounts/favor-deal/" + dealId, { method: "post" });
    const index = account.favoriteDeals.indexOf(dealId);

    if (index > -1) {
      account.favoriteDeals.splice(index, 1);
      account.favoriteDeals = [...account.favoriteDeals];
    } else {
      account.favoriteDeals = [...account.favoriteDeals, dealId];
    }
    filterFavoriteDeals();
  }

  function filterFavoriteDeals() {
    favoriteDeals = deals?.filter((deal) =>
      account.favoriteDeals.some((favorite) => favorite.toString() === deal._id.toString())
    );
  }
</script>

<ProfileHeader
  name="Jane Doe"
  street="Oxford Way"
  city="Beverly Hills, Los Angeles"
  imageUrl="/images/dummy/user-profile.svg"
  actionUrl=""
/>
<div class="tabs mt-6 max-h-8 mb-2">
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
  <DealsList {deals} favoriteDeals={account.favoriteDeals} on:favor={favor} />
{:else if showTabIndex === 1}
  <FavoritesList {favoriteDeals} on:favor={favor} />
{:else}
  <HotList />
{/if}
