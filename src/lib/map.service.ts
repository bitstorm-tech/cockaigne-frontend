import { Feature, View } from "ol";
import type { Coordinate } from "ol/coordinate";
import Circle from "ol/geom/Circle";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import Map from "ol/Map";
import "ol/ol.css";
import { useGeographic } from "ol/proj";
import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";
import { Fill, Stroke, Style } from "ol/style";
import type { Position } from "./geo/geo.types";
import { fromOpenLayersCoordinate, munichPosition, toOpenLayersCoordinate } from "./geo/geo.types";
import LocationService from "./geo/location.service";
import { locationStore, searchRadiusStore, StoreService, useCurrentLocationStore } from "./store.service";

export class MapService {
  private map: Map;
  private view = new View({
    zoom: 16,
    maxZoom: 20
  });
  private readonly circle: Circle;
  private readonly centerPoint: Circle;
  private useCurrentLocation = false;
  private center = toOpenLayersCoordinate(munichPosition);
  private searchRadius = 100;

  constructor(htmlElementId: string) {
    useGeographic();
    useCurrentLocationStore.subscribe((useCurrentLocation) => (this.useCurrentLocation = useCurrentLocation));
    searchRadiusStore.subscribe((radius) => (this.searchRadius = radius));

    this.view.setCenter(this.center);
    this.centerPoint = new Circle(this.center, this.transformRadius(2));

    this.circle = new Circle(this.center, this.transformRadius(this.searchRadius));

    this.map = new Map({
      target: htmlElementId,
      layers: [
        new TileLayer({
          source: new OSM()
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
      if (this.useCurrentLocation) {
        return;
      }

      this.moveCircle(event.coordinate);
      this.saveCenter(event.coordinate);
      LocationService.setPosition(fromOpenLayersCoordinate(event.coordinate));
    });

    locationStore.subscribe((position) => this.jumpToLocation(position));
  }

  jumpToLocation(position: Position) {
    const center = toOpenLayersCoordinate(position);
    this.view.animate({ center }, { duration: 500 });
    this.moveCircle(center);
  }

  jumpToCurrentLocation() {
    this.view.animate({ center: this.center }, { duration: 500 });
    this.moveCircle();
  }

  setRadius(radius: number) {
    this.circle.setRadius(this.transformRadius(radius));
    StoreService.saveSearchRadius(radius);
  }

  private moveCircle(location?: Coordinate) {
    const newCoordinates = location ? location : this.center;
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

    return radius / 143000;
  }

  private saveCenter(coordinate: Coordinate) {
    const position = fromOpenLayersCoordinate(coordinate);
    LocationService.setPosition(position);
  }
}
