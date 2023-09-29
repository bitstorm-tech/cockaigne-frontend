<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import DealsListItem from "$lib/components/dealer/DealsListItem.svelte";
  import EmptyContent from "$lib/components/ui/EmptyContent.svelte";
  import BookmarkIcon from "$lib/components/ui/icons/BookmarkIcon.svelte";
  import GearIcon from "$lib/components/ui/icons/GearIcon.svelte";
  import Link from "$lib/components/ui/Link.svelte";
  import { hotDealStore } from "$lib/stores/hot-deal.store";
  import type { ActiveDeal, Deal } from "$lib/supabase/public-types";

  export let deals: Deal[] | ActiveDeal[] = [];
  let openDetail = -1;

  $: {
    deals && deals?.sort((a, b) => (a.start?.localeCompare(b.start || "") || 0) * -1);
  }

  function isFavoriteDeal(deal: Deal): boolean {
    return !!$hotDealStore.find((hot) => hot.id === deal.id);
  }

  async function toggleFavoriteDeal(deal: Deal) {
    await hotDealStore.toggleHot(deal.id);
    deals = [...hotDealStore.updateHotFlag(deals)];
  }
</script>

<div class="flex flex-col gap-2">
  {#if deals.length === 0}
    {#if $page.data.isDealer}
      <EmptyContent>
        <p>Du hast noch keine aktiven Deals. Worauf wartest du?</p>
        <p>
          <Link href={"/deals/new?dealerId=" + $page.data.userId} underline>Deal erstellen!</Link>
        </p>
      </EmptyContent>
    {:else}
      <EmptyContent>
        <p>Dieser Dealer hat momentan leider keine aktiven Deals :(</p>
      </EmptyContent>
    {/if}
  {/if}
  {#each deals as deal, i}
    <DealsListItem
      {deal}
      showCompanyName={false}
      showDetails={openDetail === i}
      on:click={() => (openDetail = openDetail === i ? -1 : i)}
    >
      <svelte:fragment slot="right-action">
        {#if $page.data.isDealer}
          <button on:click={() => goto("/deals/" + deal.id)}>
            <GearIcon />
          </button>
        {:else if $page.data.userId}
          <button on:click={() => toggleFavoriteDeal(deal)}>
            <BookmarkIcon outline={!isFavoriteDeal(deal)} />
          </button>
        {/if}
      </svelte:fragment>
    </DealsListItem>
  {/each}
</div>
