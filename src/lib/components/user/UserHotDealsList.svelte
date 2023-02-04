<script lang="ts">
  import EmptyContent from "$lib/components/ui/EmptyContent.svelte";
  import UserDealListItme from "$lib/components/user/UserDealListItme.svelte";
  import type { Deal } from "$lib/database/deal/deal.model";
  import { dealStore } from "$lib/stores/deal.store";
  import { hotStore } from "$lib/stores/hot.store";

  let openDetail = -1;

  $: hotDeals = $dealStore.filter((deal: Deal) => $hotStore.includes(deal.id));
</script>

<div class="flex flex-col justify-center gap-2">
  {#if hotDeals.length === 0}
    <EmptyContent>
      <p>Hier gibt es noch keine heißen Deals.</p>
      <p>Worauf wartest du?</p>
    </EmptyContent>
  {/if}
  {#each hotDeals as deal, i}
    <UserDealListItme {deal} openDetail={openDetail === i} on:click={() => (openDetail = openDetail === i ? -1 : i)} />
  {/each}
</div>
