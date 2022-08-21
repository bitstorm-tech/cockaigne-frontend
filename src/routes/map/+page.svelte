<script lang="ts">
  import { browser } from "$app/env";
  import Button from "$lib/components/ui/Button.svelte";
  import Checkbox from "$lib/components/ui/Checkbox.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import LocationWatcher from "$lib/geo/location-watcher";
  import "leaflet/dist/leaflet.css";
  import { onMount } from "svelte";

  let mapReady = true;
  let useCurrentLocation = false;
  let address = "";
  let L;
  let map;

  onMount(async () => {
    if (!browser) {
      return;
    }

    L = await import("leaflet");
    const position = await LocationWatcher.getPosition();
    const longitude = position.coords.longitude;
    const latitude = position.coords.latitude;
    map = L.map("map").setView([latitude, longitude], 20);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
      .addTo(map)
      .on("load", () => (mapReady = true));
  });

  async function search() {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${address}`;
    const response = await fetch(url);

    if (response.ok) {
      const addresses = await response.json();
      console.log(addresses);
      if (addresses.length === 0) {
        return;
      }

      const longitude = addresses[0].lon;
      const latitude = addresses[0].lat;
      map?.setView([latitude, longitude], 20);
    }
  }

  async function searchCurrentLocation() {
    if (useCurrentLocation) {
      console.log("---");
      const position = await LocationWatcher.getPosition();
      const longitude = position.coords.longitude;
      const latitude = position.coords.latitude;
      map?.setView([latitude, longitude], 20);
    }
  }
</script>

<div class="flex flex-col m-2">
  {useCurrentLocation}
  <div on:click={searchCurrentLocation}>
    <Checkbox label="Aktuellen Standort verwenden" bind:checked={useCurrentLocation} />
  </div>
  {#if !useCurrentLocation}
    <div class="flex gap-2 items-end">
      <Input label="Adresse" bind:value={address} on:enter={search} />
      <Button on:click={search}>Suchen</Button>
    </div>
  {/if}
</div>
{#if mapReady}
  <hr id="map" class="w-screen h-[calc(100vh-6rem)] m-auto z-0" />
{:else}
  <h1>Karte wird geladen ...</h1>
{/if}
