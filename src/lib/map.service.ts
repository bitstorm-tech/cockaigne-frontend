import { Feature, View } from "ol";
import type { Coordinate } from "ol/coordinate";
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
import { selectedCategoriesStore } from "./database/category/category.store";
import type { Deal } from "./database/deal/deal.model";
import { dealStore } from "./database/deal/deal.store";
import type { Position } from "./geo/geo.types";
import { fromOpenLayersCoordinate, toOpenLayersCoordinate } from "./geo/geo.types";
import LocationService from "./geo/location.service";
import { getIconPathById } from "./icon-mapping";
import { locationStore, searchRadiusStore, StoreService, useCurrentLocationStore } from "./store.service";

export class MapService {
  private map: Map;
  private dealLayerSource = new VectorSource();
  private view = new View({
    zoom: 16,
    maxZoom: 20
  });
  private readonly circle: Circle;
  private readonly centerPoint: Circle;

  constructor(htmlElementId: string) {
    useGeographic();
    searchRadiusStore.subscribe(async (radius) => {
      const location = get(locationStore);
      const selectedCategories = get(selectedCategoriesStore);
      await dealStore.load(location, radius / 2, selectedCategories);
    });
    dealStore.subscribe((deals) => this.setDeals(deals));
    const center = toOpenLayersCoordinate(get(locationStore));

    this.view.setCenter(center);

    this.centerPoint = new Circle(center, this.transformRadius(2));

    const searchRadius = get(searchRadiusStore);
    this.circle = new Circle(center, this.transformRadius(searchRadius));

    this.map = new Map({
      target: htmlElementId,
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        new VectorLayer({
          source: this.dealLayerSource,
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
            features: [new Feature(this.circle), new Feature(this.centerPoint)]
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
      view: this.view
    });

    this.map.on("click", (event) => {
      const useCurrentLocation = get(useCurrentLocationStore);

      if (useCurrentLocation) {
        return;
      }

      this.moveCircle(event.coordinate);
      this.saveCenter(event.coordinate);
      LocationService.setPosition(fromOpenLayersCoordinate(event.coordinate));
    });

    locationStore.subscribe(async (position) => {
      const radius = get(searchRadiusStore);
      const selectedCategories = get(selectedCategoriesStore);
      this.jumpToLocation(position);
      await dealStore.load(position, radius / 2, selectedCategories);
    });

    selectedCategoriesStore.subscribe(async (selectedCategories) => {
      await dealStore.load(get(locationStore), get(searchRadiusStore) / 2, selectedCategories);
    });
  }

  jumpToLocation(position: Position) {
    const center = toOpenLayersCoordinate(position);
    this.moveCircle(center);
  }

  jumpToCurrentLocation() {
    const center = toOpenLayersCoordinate(get(locationStore));
    this.view.setCenter(center);
    this.moveCircle();
  }

  setRadius(radius: number) {
    this.circle.setRadius(this.transformRadius(radius));
    StoreService.saveSearchRadius(radius);
  }

  setDeals(deals: Deal[]) {
    this.dealLayerSource.clear(true);
    deals.map((deal) => {
      const coordinate = this.parseWKT(deal.location as string);
      if (coordinate) {
        const icon = this.createIcon(deal, coordinate);
        this.dealLayerSource.addFeature(icon);
      }
    });
  }

  private moveCircle(location?: Coordinate) {
    const center = toOpenLayersCoordinate(get(locationStore));
    const newCoordinates = location ? location : center;
    this.circle.setCenter(newCoordinates);
    this.centerPoint.setCenter(newCoordinates);
  }

  private transformRadius(radius: number) {
    // TODO transform correctly with OpenLayers methods
    // const projection = this.view.getProjection();
    // const pointResolution = getPointResolution(projection, 1, center);
    // const transformedRadius = radius / pointResolution;
    //
    // console.log("projection, pointResolution, transformedRadius = ", projection, pointResolution, transformedRadius);
    // console.log("units", projection.getUnits());

    return radius / 149500;
  }

  private parseWKT(wkt: string): number[] | undefined {
    return wkt.match(/[+-]?\d+(\.\d+)?/g)?.map((value) => parseFloat(value));
  }

  private createIcon(deal: Deal, coordinate: Coordinate): Feature {
    const feature = new Feature({
      geometry: new Point(coordinate)
    });

    const style = new Style({
      image: new Icon({
        src: getIconPathById(deal.category),
        scale: 0.08
      })
    });

    feature.setStyle(style);

    return feature;
  }

  private saveCenter(coordinate: Coordinate) {
    const position = fromOpenLayersCoordinate(coordinate);
    LocationService.setPosition(position);
  }
}
