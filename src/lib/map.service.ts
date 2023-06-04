import { page } from "$app/stores";
import { isLocationWatcherStarted, stopLocationWatching } from "$lib/geo/location-watcher";
import { categoryStore } from "$lib/stores/category.store";
import { dealStore } from "$lib/stores/deal.store";
import { locationStore } from "$lib/stores/location.store";
import { getDealsByFilter } from "$lib/supabase/deal-service";
import { saveLocation, saveUseCurrentLocation } from "$lib/supabase/location-service";
import debounce from "lodash/debounce";
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
import { fromOpenLayersCoordinate, toOpenLayersCoordinate } from "./geo/geo.types";
import { getIconPathById } from "./icon-mapping";
import { searchRadiusStore } from "./stores/search-radius.store";
import type { ActiveDeal, DealFilter, Location } from "./supabase/public-types";

useGeographic();

const dealLayerSource = new VectorSource();
const view = new View({
  zoom: 16,
  maxZoom: 20
});
let circle: Circle;
let centerPoint: Circle;

const saveLocationInternal = debounce(async (location: Position) => {
  const supabase = get(page).data.supabase;
  const userId = get(page).data.userId;
  if (!userId) return;
  await saveLocation(supabase, userId, location);
}, 1000);

const updateDealsOnMap = debounce(async (extent: Extent) => {
  const filter: DealFilter = {
    categoryIds: get(categoryStore).map((c) => c.id),
    extent
  };

  const supabase = get(page).data.supabase;
  const deals = await getDealsByFilter(supabase, filter);
  setDeals(deals);
}, 500);

locationStore.subscribe((location) => {
  if (!isLocationWatcherStarted()) return;
  jumpToLocation(location);
  dealStore.updateByCurrentFilters();
});

searchRadiusStore.subscribe((searchRadius) => {
  setRadius(searchRadius);
  dealStore.updateByCurrentFilters();
});

export function initMapService(htmlElementId: string) {
  const center = toOpenLayersCoordinate(get(locationStore));
  const searchRadius = transformRadius(get(searchRadiusStore));

  view.setCenter(center);
  centerPoint = new Circle(center, transformRadius(2));
  circle = new Circle(center, searchRadius);

  const map = new Map({
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
    const supabase = get(page).data.supabase;
    const userId = get(page).data.userId;

    if (userId) {
      saveUseCurrentLocation(supabase, userId, false).then();
    }

    stopLocationWatching();
    moveCircle(event.coordinate);
    locationStore.set(fromOpenLayersCoordinate(event.coordinate));
    saveLocationInternal(fromOpenLayersCoordinate(event.coordinate));
  });

  map.on("moveend", () => {
    const extend = map.getView().calculateExtent(map.getSize());
    updateDealsOnMap(extend);
  });

  moveCircle(center);
}

export function jumpToLocation(position?: Position) {
  const center = position ? toOpenLayersCoordinate(position) : toOpenLayersCoordinate(get(locationStore));
  view.setCenter(center);
  moveCircle(center);
}

export function setRadius(radius: number) {
  circle?.setRadius(transformRadius(radius));
  centerPoint?.setRadius(transformRadius(2));
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

function moveCircle(location: Coordinate) {
  const radius = get(searchRadiusStore);
  circle?.setCenterAndRadius(location, transformRadius(radius));
  centerPoint.setCenterAndRadius(location, transformRadius(2));
  dealStore.updateByCurrentFilters(get(page).data.supabase);
}

function transformRadius(radius: number) {
  // TODO transform correctly with OpenLayers methods
  // const projection = this.view.getProjection();
  // const pointResolution = getPointResolution(projection, 1, center);
  // const transformedRadius = radius / pointResolution;
  //
  // console.log("projection, pointResolution, transformedRadius = ", projection, pointResolution, transformedRadius);
  // console.log("units", projection.getUnits());

  return radius / 74750;
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
