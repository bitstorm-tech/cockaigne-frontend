<script lang="ts">
  import Button from "$lib/components/ui/Button.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import { getAddress, getLocation } from "$lib/geo/address.service";
  import type { Position } from "$lib/geo/geo.types";
  import type { Account } from "$lib/supabase/public-types";
  import type { LeafletMouseEvent } from "leaflet";
  import L, { Map, Marker } from "leaflet";
  import { onMount } from "svelte";

  export let account: Account;

  let map: Map;
  let marker: Marker;
  let loading = false;

  onMount(() => {
    const [x, y] = account?.location?.split(" ").map(Number) || [0, 0];
    map = L.map("map", {
      center: [x, y],
      zoom: 17
    });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
    marker = L.marker([x, y]);
    marker.addTo(map);
    map.on("click", onMapClick);
  });

  async function showOnMap() {
    loading = true;
    const address = `${account.house_number} ${account.street}, ${account.city} ${account.zip}, Germany`;
    const location = (await getLocation(address)) || { latitude: 0, longitude: 0 };

    if (!account.zip) {
      account.zip = (await getAddress(location))?.postcode;
    }

    map.panTo([location.latitude, location.longitude]);
    marker.setLatLng([location.latitude, location.longitude]);
    loading = false;
  }

  async function onMapClick(event: LeafletMouseEvent) {
    loading = true;
    const position: Position = {
      longitude: event.latlng.lng,
      latitude: event.latlng.lat
    };

    marker.setLatLng([position.latitude, position.longitude]);
    const address = await getAddress(position);

    account.street = address?.street;
    account.house_number = address?.houseNumber;
    account.zip = address?.postcode;
    account.city = address?.city;

    loading = false;
  }
</script>

<div class="grid grid-cols-3 gap-3">
  <div class="col-span-2">
    <Input label="Straße" bind:value={account.street} />
  </div>
  <Input label="Hausnummer" bind:value={account.house_number} />
</div>
<div class="grid grid-cols-3 gap-3">
  <div class="col-span-2">
    <Input label="Ort" bind:value={account.city} />
  </div>
  <Input label="PLZ" bind:value={account.zip} />
</div>
<Button on:click={showOnMap} {loading}>Auf Karte anzeigen</Button>
<div id="map" class="flex h-72 items-center justify-center" />
