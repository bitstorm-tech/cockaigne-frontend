import type { Position } from "./geo.types";

export interface Address {
  street: string;
  city: string;
  postcode: number;
  country: string;
}

export async function getAddress(position: Position): Promise<Address | undefined> {
  const { longitude, latitude } = position;
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
  const response = await fetch(url);

  if (response.ok) {
    const address = await response.json();
    if (!address) {
      return;
    }

    const { road, house_number, city, postcode, country } = address.address;

    return {
      street: `${road || ""} ${house_number || ""}`.trim(),
      city: city || "",
      postcode: postcode || "",
      country: country || ""
    };
  }
}

export function addressToString(address: Address): string {
  return address ? `${address.street}, ${address.postcode} ${address.city}, ${address.country}` : "Keine Adresse";
}

export function addressToShortString(address: Address | undefined): string {
  return address ? `${address.street}, ${address.city}` : "Keine Adresse";
}
