<script lang="ts">
  import { afterNavigate, beforeNavigate } from "$app/navigation";
  import { page } from "$app/stores";
  import Footer from "$lib/components/nav/Footer.svelte";
  import Navbar from "$lib/components/nav/Navbar.svelte";
  import LoadingSpinner from "$lib/components/ui/icons/LoadingSpinner.svelte";
  import LocationService from "$lib/geo/location.service";
  import { locationStore, StoreService, useCurrentLocationStore } from "$lib/store.service";
  import { blur } from "svelte/transition";
  import "../tailwind.css";

  StoreService.init();
  if ($useCurrentLocationStore) {
    LocationService.startWatching();
  } else {
    LocationService.setPosition($locationStore);
  }

  let loading = false;

  beforeNavigate(() => {
    loading = true;
  });
  afterNavigate(() => {
    loading = false;
  });
</script>

{#if $page.data.user.isAuthenticated}
  <Navbar />
{/if}
{#if loading}
  <div class="flex items-center gap-3 pt-36 px-14">
    <LoadingSpinner size="5" />
    <p>Lade Deals und alles was sonst noch so dazu gehört ...</p>
  </div>
{:else}
  <div class="pb-16" in:blur>
    <slot />
  </div>
{/if}
{#if $page.data.user.isAuthenticated}
  <Footer />
{/if}
