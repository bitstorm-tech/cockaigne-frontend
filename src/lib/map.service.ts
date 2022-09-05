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

export class MapService {
  private map: Map;
  private currentLocation: Coordinate;
  private view = new View({
    zoom: 18,
    maxZoom: 20
  });
  private readonly circle: Circle;
  private readonly centerPoint: Circle;

  constructor(htmlElementId: string, center: number[], private searchRadius: number, private enableClick = true) {
    useGeographic();
    this.view.setCenter(center);
    this.currentLocation = center;
    this.centerPoint = new Circle(center, this.transformRadius(2));
    this.circle = new Circle(center, this.transformRadius(searchRadius));

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
      if (!this.enableClick) {
        return;
      }

      this.moveCircle(event.coordinate);
      this.currentLocation = event.coordinate;
    });
  }

  jumpToLocation(center: Coordinate) {
    this.currentLocation = center;
    this.view.animate({ center }, { zoom: 18 });
    this.moveCircle();
  }

  jumpToCurrentLocation() {
    this.view.animate({ center: this.currentLocation }, { zoom: 18 });
    this.moveCircle();
  }

  setRadius(radius: number) {
    this.searchRadius = radius;
    this.circle.setRadius(this.transformRadius(radius));
  }

  getRadius(): number {
    return this.searchRadius;
  }

  setEnableClick(enableClick: boolean) {
    this.enableClick = enableClick;
  }

  private moveCircle(location?: Coordinate) {
    const newCoordinates = location ? location : this.currentLocation;
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
}
