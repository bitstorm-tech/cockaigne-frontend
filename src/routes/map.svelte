<script lang="ts">
  import { browser } from "$app/env";
  import LocationWatcher from "$lib/geo/location-watcher";
  import "leaflet/dist/leaflet.css";
  import { onMount } from "svelte";

  let mapReady = true;

  onMount(async () => {
    if (!browser) {
      return;
    }

    const L = await import("leaflet");
    const position = await LocationWatcher.getPosition();
    const longitude = position.coords.longitude;
    const latitude = position.coords.latitude;
    const map = L.map("map").setView([latitude, longitude], 20);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
      .addTo(map)
      .on("load", () => (mapReady = true));
  });
</script>

{#if mapReady}
  <hr id="map" class="w-screen h-[calc(100vh-6rem)] m-auto mt-4 z-0" />
{:else}
  <h1>Karte wird geladen ...</h1>
{/if}
