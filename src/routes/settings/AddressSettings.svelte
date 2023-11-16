<script lang="ts">
  import Button from "$lib/components/ui/Button.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import { getLocation } from "$lib/geo/address.service";
  import { toOpenLayersCoordinate } from "$lib/geo/geo.types";
  import type { Account } from "$lib/supabase/public-types";
  import Feature from "ol/Feature";
  import Map from "ol/Map";
  import View from "ol/View";
  import Point from "ol/geom/Point";
  import TileLayer from "ol/layer/Tile";
  import VectorLayer from "ol/layer/Vector";
  import "ol/ol.css";
  import { useGeographic } from "ol/proj";
  import OSM from "ol/source/OSM";
  import VectorSource from "ol/source/Vector";
  import { Icon, Style } from "ol/style";
  import { onMount } from "svelte";

  export let account: Account;
  const pinLayerSource = new VectorSource();
  const view = new View({
    zoom: 16,
    maxZoom: 20
  });
  const iconFeature = new Feature(new Point(account.location.coordinates));
  pinLayerSource.addFeature(iconFeature);

  onMount(async () => {
    useGeographic();

    new Map({
      target: "map",
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        new VectorLayer({
          source: pinLayerSource,
          style: new Style({
            image: new Icon({
              scale: 0.1,
              displacement: [0, 16],
              src: "/icons/pin.png"
            })
          })
        })
      ],
      view
    });

    view.setCenter(account.location.coordinates);
  });

  async function showOnMap() {
    const coordinates = await getLocation(account);
    if (coordinates) {
      const olCoordinates = toOpenLayersCoordinate(coordinates);
      view.setCenter(olCoordinates);
      pinLayerSource.clear();
      pinLayerSource.addFeature(new Feature(new Point(olCoordinates)));
    }
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
<span>
  Bitte prüfe genau, ob die Adresse auf der Karte korrekt angezeigt wird. Es ist extrem wichtig, dass die Position auf
  der Karte stimmt, da hier die eingestellten Deals angezeigt werden!
</span>
<Button small on:click={showOnMap}>Auf Karte anzeigen</Button>
<div id="map" class="h-52 w-full"></div>
