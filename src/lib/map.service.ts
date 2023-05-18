import { page } from "$app/stores";
import { stopLocationWatching } from "$lib/geo/location-watcher";
import { locationStore } from "$lib/stores/location.store";
import { getDealsByFilter } from "$lib/supabase/deal-service";
import { getLocation, getSearchRadius, saveLocation, saveUseCurrentLocation } from "$lib/supabase/location-service";
import { debounce } from "lodash";
import { Feature, View } from "ol";
import type { Coordinate } from "ol/coordinate";
import type { Extent } from "ol/extent";
import { Point } from "ol/geom";
import Circle from "ol/geom/Circle";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import Map from "ol/Map";
import "ol/ol.css";
import { useGeographic } from "ol/proj";
import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";
import { Fill, Icon, Stroke, Style } from "ol/style";
import { get } from "svelte/store";
import type { Position } from "./geo/geo.types";
import { centerOfGermany, fromOpenLayersCoordinate, toOpenLayersCoordinate } from "./geo/geo.types";
import { getIconPathById } from "./icon-mapping";
import type { ActiveDeal, DealFilter, Location } from "./supabase/public-types";

let map: Map;
const dealLayerSource = new VectorSource();
const view = new View({
  zoom: 16,
  maxZoom: 20
});
let circle: Circle;
let centerPoint: Circle;

// createEffect(() => setRadius(searchRadius()));
// createEffect(() => jumpToLocation(location()));
locationStore.subscribe((location) => jumpToLocation(location));

const saveLocationDebounced = debounce(async (location: Position) => {
  const supabase = get(page).data.supabase;
  const userId = get(page).data.userId;
  if (!userId) return;
  await saveLocation(supabase, userId, location);
}, 1000);

const updateDeals = debounce(async (extent: Extent) => {
  const filter: DealFilter = {
    categoryIds: [],
    extent
  };

  const supabase = get(page).data.supabase;
  const deals = await getDealsByFilter(supabase, filter);
  setDeals(deals);
}, 1000);

export async function initMapService(htmlElementId: string) {
  useGeographic();
  const supabase = get(page).data.supabase;
  const userId = get(page).data.userId;
  const location = userId ? await getLocation(supabase, userId) : centerOfGermany;
  const searchRadius = userId ? transformRadius(await getSearchRadius(supabase, userId)) : 500;
  const center = toOpenLayersCoordinate(location);

  view.setCenter(center);
  centerPoint = new Circle(center, transformRadius(2));
  circle = new Circle(center, searchRadius);

  map = new Map({
    target: htmlElementId,
    layers: [
      new TileLayer({
        source: new OSM()
      }),
      new VectorLayer({
        source: dealLayerSource,
        style: new Style({
          stroke: new Stroke({
            color: "red",
            width: 3
          }),
          fill: new Fill({
            color: "red"
          })
        })
      }),
      new VectorLayer({
        source: new VectorSource({
          features: [new Feature(circle), new Feature(centerPoint)]
        }),
        style: new Style({
          stroke: new Stroke({
            color: "blue",
            width: 3
          }),
          fill: new Fill({
            color: "rgba(0, 0, 225, 0.1)"
          })
        })
      })
    ],
    view
  });

  map.on("click", async (event) => {
    if (userId) {
      saveUseCurrentLocation(supabase, userId, false).then();
    }
    stopLocationWatching();
    moveCircle(event.coordinate).then();
    locationStore.set(fromOpenLayersCoordinate(event.coordinate));
    saveLocationDebounced(fromOpenLayersCoordinate(event.coordinate));
  });

  map.on("moveend", () => {
    const extend = map.getView().calculateExtent(map.getSize());
    updateDeals(extend);
  });
}

export function jumpToLocation(position: Position) {
  const center = toOpenLayersCoordinate(position);
  view.setCenter(center);
  moveCircle(center).then();
}

export async function jumpToCurrentLocation() {
  const postion = get(locationStore);
  const center = toOpenLayersCoordinate(postion);
  view.setCenter(center);
  moveCircle(center).then();
}

export function setRadius(radius: number) {
  circle?.setRadius(transformRadius(radius));
}

function setDeals(deals: ActiveDeal[]) {
  dealLayerSource.clear(true);
  deals.map((deal) => {
    const coordinate = (deal.location! as Location).coordinates;
    if (coordinate) {
      const icon = createIcon(deal, coordinate);
      dealLayerSource.addFeature(icon);
    }
  });
}

async function moveCircle(location: Coordinate) {
  circle?.setCenter(location);
  centerPoint?.setCenter(location);
}

function transformRadius(radius: number) {
  // TODO transform correctly with OpenLayers methods
  // const projection = this.view.getProjection();
  // const pointResolution = getPointResolution(projection, 1, center);
  // const transformedRadius = radius / pointResolution;
  //
  // console.log("projection, pointResolution, transformedRadius = ", projection, pointResolution, transformedRadius);
  // console.log("units", projection.getUnits());

  return radius / 149500;
}

function createIcon(deal: ActiveDeal, coordinate: Coordinate): Feature {
  const feature = new Feature({
    geometry: new Point(coordinate)
  });

  const style = new Style({
    image: new Icon({
      src: getIconPathById(deal.category_id!),
      scale: 0.08
    })
  });

  feature.setStyle(style);

  return feature;
}
