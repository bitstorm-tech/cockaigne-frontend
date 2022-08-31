import { Feature, View } from "ol";
import type { Coordinate } from "ol/coordinate";
import { Circle } from "ol/geom";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import Map from "ol/Map";
import "ol/ol.css";
import { useGeographic } from "ol/proj";
import { OSM } from "ol/source";
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
  private radiusFactor = 0.001;

  constructor(htmlElementId: string, center: number[]) {
    useGeographic();
    this.view.setCenter(center);
    this.currentLocation = center;
    this.circle = new Circle(center, this.radiusFactor);
    this.centerPoint = new Circle(center, 0.00002);

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
              color: "rgba(0, 0, 255, 0.1)"
            })
          })
        })
      ],
      view: this.view
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
    this.circle.setRadius(radius * this.radiusFactor);
  }

  private moveCircle() {
    this.circle.setCenter(this.currentLocation);
    this.centerPoint.setCenter(this.currentLocation);
  }
}
