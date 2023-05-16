import type { LngLatLike } from "mapbox-gl";
import type { Coordinate } from "ol/coordinate";

export interface Position {
  latitude: number;
  longitude: number;
}

export type AddressSearchResult = {
  location: Position;
  address: string;
};

export type NominatimSearchResult = {
  lat: number;
  lon: number;
  display_name: string;
};

export const munichPosition: Position = {
  longitude: 11.576124,
  latitude: 48.137154
};

export function toOpenLayersCoordinate(position: Position): Coordinate {
  return [position.longitude, position.latitude];
}

export function fromOpenLayersCoordinate(coordinate: Coordinate): Position {
  return {
    longitude: coordinate[0],
    latitude: coordinate[1]
  };
}

export function toPostGisPoint(position: Position): string {
  return `POINT(${position.longitude} ${position.latitude})`;
}

export function toMapboxCoordinates(positoin: Position): LngLatLike {
  return [positoin.longitude, positoin.latitude];
}
