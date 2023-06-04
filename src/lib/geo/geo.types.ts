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
  lat: string;
  lon: string;
  display_name: string;
};

export const centerOfGermany: Position = {
  longitude: 10.447683,
  latitude: 51.163361
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
