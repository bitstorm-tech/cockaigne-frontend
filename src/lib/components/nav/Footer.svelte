<script lang="ts">
  import { page } from "$app/stores";
  import DealsOverviewIcon from "$lib/components/ui/icons/DealsOverviewIcon.svelte";
  import HomeIcon from "$lib/components/ui/icons/HomeIcon.svelte";
  import MapIcon from "$lib/components/ui/icons/MapIcon.svelte";
  import TopIcon from "$lib/components/ui/icons/TopIcon.svelte";
  import { navigationStore } from "$lib/stores/navigation.store";
</script>

{#if $page.data.user.isDealer}
  <footer class="btm-nav btm-nav-sm h-12 border-t-[0.01rem] border-t-[#556368] text-[#69828c]">
    <a href="/">
      <HomeIcon active={$navigationStore === "home"} />
    </a>
    <a href={`/deals/overview/${$page.data.user.id}`}>
      <DealsOverviewIcon active={$navigationStore === "dealOverview"} />
    </a>
  </footer>
{:else}
  <footer class="btm-nav btm-nav-sm h-12 border-t-[0.01rem] border-t-[#556368] text-[#69828c]">
    <a href="/">
      <HomeIcon active={$navigationStore === "home"} />
    </a>
    <a href="/top">
      <TopIcon active={$navigationStore === "top"} />
    </a>
    <a href="/map">
      <MapIcon active={$navigationStore === "map"} />
    </a>
  </footer>
{/if}
