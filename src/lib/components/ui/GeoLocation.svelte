<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/env';

  let geoLocationCoordinates: GeolocationCoordinates;
  let watchId: number;

  onMount(() => {
    if (!browser) {
      return;
    }
    window.navigator.geolocation.watchPosition((position: GeolocationPosition) => {
      geoLocationCoordinates = position.coords;
    });
  });

  onDestroy(() => {
    if (browser) {
      window.navigator.geolocation.clearWatch(watchId);
    }
  });
</script>

{#if geoLocationCoordinates}
  <p>Dein Standort: {geoLocationCoordinates.latitude}/{geoLocationCoordinates.longitude}</p>
{:else}
  <p>Dein Standort wird ermittelt...</p>
{/if}
