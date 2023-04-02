<script lang="ts">
  import EmptyContent from "$lib/components/ui/EmptyContent.svelte";
  import Link from "$lib/components/ui/Link.svelte";
  import UserDealListItme from "$lib/components/user/UserDealListItme.svelte";
  import { dealStore } from "$lib/stores/deal.store";
  import { hotDealStore } from "$lib/stores/hot-deal.store";
  import { likeStore } from "$lib/stores/like.store";
  import { onMount } from "svelte";

  export let showCompanyName = true;
  export let showHotIcon = true;
  export let deals = $dealStore;

  $: {
    $dealStore && $hotDealStore;
    deals = hotDealStore.updateHotFlag($dealStore);
  }

  let openDetail = -1;

  onMount(async () => {
    await Promise.all([hotDealStore.load(), dealStore.load(), likeStore.load()]);
  });
</script>

<div class="flex flex-col gap-1">
  {#if deals.length === 0}
    <EmptyContent>
      <p>Aktuell gibt es leider keine Deals in deiner Nähe :(</p>
      <p>
        <Link href="/map?showFilter=true" underline>Filter anpassen</Link>
        oder
        <Link href="/map" underline>Standort ändern</Link>
        !
      </p>
    </EmptyContent>
  {/if}
  {#each deals as deal, i}
    <UserDealListItme
      {deal}
      {showCompanyName}
      {showHotIcon}
      openDetail={openDetail === i}
      on:click={() => (openDetail = openDetail === i ? -1 : i)}
    />
  {/each}
</div>
