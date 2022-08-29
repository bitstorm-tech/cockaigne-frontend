<script lang="ts">
  import { browser } from "$app/environment";
  import { onDestroy, onMount } from "svelte";

  let watchId: number;
  let address: string;

  onMount(() => {
    if (!browser) {
      return;
    }
    window.navigator.geolocation.watchPosition(getAddress);
  });

  onDestroy(() => {
    if (browser) {
      window.navigator.geolocation.clearWatch(watchId);
    }
  });

  async function getAddress(position: GeolocationPosition) {
    const longitude = position.coords.longitude;
    const latitude = position.coords.latitude;
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
    const response = await fetch(url);
    const json = await response.json();
    address = `${json.address.road} ${json.address.house_number}, ${json.address.postcode} ${json.address.city}`;
  }
</script>

{#if address}
  <p>Dein Standort</p>
  <p>{address}</p>
{:else}
  <p>Dein Standort</p>
  <p>wird ermittelt...</p>
{/if}
