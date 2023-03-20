<script lang="ts">
  import EmptyContent from "$lib/components/ui/EmptyContent.svelte";
  import UserDealListItme from "$lib/components/user/UserDealListItme.svelte";
  import { dealStore } from "$lib/stores/deal.store";

  let openDetail = -1;
  $: hotDeals = $dealStore.filter((deal) => deal.isHot) ?? [];
</script>

<div class="flex flex-col justify-center gap-1">
  {#if hotDeals.length === 0}
    <EmptyContent>
      <p>Hier gibt es noch keine heißen Deals.</p>
    </EmptyContent>
  {/if}
  {#each hotDeals as deal, i}
    <UserDealListItme {deal} openDetail={openDetail === i} on:click={() => (openDetail = openDetail === i ? -1 : i)} />
  {/each}
</div>
