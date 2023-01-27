<script lang="ts">
  import { page } from "$app/stores";
  import DealsOverviewIcon from "$lib/components/ui/icons/DealsOverviewIcon.svelte";
  import HomeIcon from "$lib/components/ui/icons/HomeIcon.svelte";
  import MapIcon from "$lib/components/ui/icons/MapIcon.svelte";
  import TopIcon from "$lib/components/ui/icons/TopIcon.svelte";
  import { navigationStore } from "$lib/stores/navigation.store";
</script>

{#if $page.data.user.isDealer}
  <footer class="btm-nav btm-nav-sm border-t-[0.01rem] border-t-[#556368] text-[#69828c] h-12">
    <a href="/">
      <HomeIcon />
    </a>
    <a href={`/deals/overview/${$page.data.user.id}`}>
      <DealsOverviewIcon />
    </a>
  </footer>
{:else}
  <footer class="btm-nav btm-nav-sm border-t-[0.01rem] border-t-[#556368] text-[#69828c] h-12">
    <a href="/">
      <HomeIcon outline={$navigationStore !== "home"} />
    </a>
    <a href="/top">
      <TopIcon outline={$navigationStore !== "top"} />
    </a>
    <a href="/map">
      <MapIcon outline={$navigationStore !== "map"} />
    </a>
  </footer>
{/if}
