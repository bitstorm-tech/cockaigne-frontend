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
  let tabIndex = 10;
  let loading = true;
  let topDeals: ActiveDeal[] = [];
  const supabase = $page.data.supabase;
  const userId = $page.data.session.user.id;

  onMount(() => {
    likeStore.load();
    switchTab(tabIndex);
  });

  async function switchTab(numberOfDeals: number) {
    if (!browser) return;

    loading = true;
    tabIndex = numberOfDeals;
    topDeals = await getTopDeals(supabase, userId, numberOfDeals);
    loading = false;
  }
</script>

<p class="my-4 text-center">TOP-Deals in deiner Nähe</p>
<div class="tabs mb-1 flex max-h-8">
  <button on:click={() => switchTab(10)} class="tab-bordered tab grow" class:tab-active={tabIndex === 10}>
    Top 10
  </button>
  <button on:click={() => switchTab(25)} class="tab-bordered tab grow" class:tab-active={tabIndex === 25}>
    Top 25
  </button>
  <button on:click={() => switchTab(50)} class="tab-bordered tab grow" class:tab-active={tabIndex === 50}>
    Top 50
  </button>
  <button on:click={() => switchTab(100)} class="tab-bordered tab grow" class:tab-active={tabIndex === 100}>
    Top 100
  </button>
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
