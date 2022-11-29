<script lang="ts">
  import { page } from "$app/stores";
  import Footer from "$lib/components/nav/Footer.svelte";
  import Navbar from "$lib/components/nav/Navbar.svelte";
  import LocationService from "$lib/geo/location.service";
  import { locationStore, StoreService, useCurrentLocationStore } from "../lib/store.service";
  import "../tailwind.css";

  StoreService.init();
  if ($useCurrentLocationStore) {
    LocationService.startWatching();
  } else {
    LocationService.setPosition($locationStore);
  }
</script>

{#if $page.data.user.isAuthenticated}
  <Navbar />
{/if}
{#key $page.url}
  <div class="pb-16">
    <slot />
  </div>
{/key}
{#if $page.data.user.isAuthenticated}
  <Footer />
{/if}
