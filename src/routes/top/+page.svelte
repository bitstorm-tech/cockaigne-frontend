<script lang="ts">
  import { browser } from "$app/environment";
  import { page } from "$app/stores";
  import LoadingSpinner from "$lib/components/ui/icons/LoadingSpinner.svelte";
  import UserDealsList from "$lib/components/user/UserDealsList.svelte";
  import { likeStore } from "$lib/stores/like.store";
  import { navigationStore } from "$lib/stores/navigation.store";
  import { getTopDeals } from "$lib/supabase/deal-service";
  import type { ActiveDeal } from "$lib/supabase/public-types";
  import { onMount } from "svelte";

  navigationStore.currentPage("top");
  let tabIndex = 25;
  let loading = true;
  let topDeals: ActiveDeal[] = [];
  const supabase = $page.data.supabase;
  const userId = $page.data.userId;

  onMount(() => {
    likeStore.load($page.data.supabase);
    switchTab(tabIndex);
  });

  async function switchTab(numberOfDeals: number) {
    if (!browser || !userId) return;

    loading = true;
    tabIndex = numberOfDeals;
    topDeals = await getTopDeals(supabase, userId, numberOfDeals);
    loading = false;
  }
</script>

<p class="my-4 text-center">TOP-Deals in deiner Nähe</p>
<div class="tabs tabs-bordered mb-1">
  <button on:click={() => switchTab(25)} class="tab" class:tab-active={tabIndex === 25}>Top 25</button>
  <button on:click={() => switchTab(100)} class="tab" class:tab-active={tabIndex === 150}>Alle</button>
</div>
<section class="flex flex-col">
  {#if loading}
    <div class="flex items-center justify-center gap-3 pt-6">
      <LoadingSpinner />
      <p>Suche die TOP-Deals ...</p>
    </div>
  {:else}
    <UserDealsList deals={topDeals} liveUpdate={false} />
  {/if}
</section>
