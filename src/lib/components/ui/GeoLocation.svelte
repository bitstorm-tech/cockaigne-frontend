<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/env';

  let geoLocationCoordinates: GeolocationCoordinates;
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
    geoLocationCoordinates = position.coords;
    const longitude = position.coords.longitude;
    const latitude = position.coords.latitude;
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
    const resposne = await fetch(url);
    const json = await resposne.json();
    address = `${json.address.road} ${json.address.house_number}, ${json.address.postcode} ${json.address.city}`;
  }
</script>

{#if geoLocationCoordinates}
  <p>Dein Standort: {address} [{geoLocationCoordinates.latitude} / {geoLocationCoordinates.longitude}]</p>
{:else}
  <p>Dein Standort wird ermittelt...</p>
{/if}
