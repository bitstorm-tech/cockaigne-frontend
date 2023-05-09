import { munichPosition, toPostGisPoint, type Position } from "$lib/geo/geo.types";
import type { Account, AccountUpdate } from "./public-types";
import { supabase, translateError, type Supabase } from "./supabase-client";

export type RegistrationData = {
  password: string;
  isDealer: boolean;
  defaultCategory: number;
  street: string;
  houseNumber: string;
  city: string;
  zip: string;
  phone: string;
  username: string;
  email: string;
  age: string;
  gender: string;
  taxId: string;
};

export async function getDefaultCategory(): Promise<number> {
  const { data, error } = await supabase.from("accounts").select("default_category").single();

  if (error) {
    console.error("Can't get default category:", error);
    return -1;
  }

  return data.default_category || -1;
}

export async function getAccount(supabase: Supabase, userId: string): Promise<Account | undefined> {
  const { data, error } = await supabase.from("accounts").select().eq("id", userId).single();

  if (error) {
    console.error("Can't get account:", error);
    return;
  }

  return data;
}

export async function updateAccount(supabase: Supabase, update: AccountUpdate): Promise<string | undefined> {
  const { error } = await supabase.from("accounts").update(update).eq("id", update.id);

  if (error) {
    console.log("Can't update account:", error);
    if (error.code === "23505") {
      return "Benutzername bereits vergeben";
    }
  }
}

export async function getLocation(
  street: string,
  houseNumber: string,
  city: string,
  zip: string
): Promise<Position | null> {
  const query = `format=json&street=${houseNumber} ${street}&city=${city}&postalcode=${zip}`;
  const response = await fetch(`https://nominatim.openstreetmap.org/search?${query}`);
  const geoInformation = await response.json();

  if (geoInformation.length === 0) {
    console.error("Can't find location for address:", street, houseNumber, zip, city);
    return null;
  }

  return {
    latitude: geoInformation[0].lat,
    longitude: geoInformation[0].lon
  };
}

export async function register(registrationData: RegistrationData): Promise<string | undefined> {
  let position: Position = munichPosition;

  if (registrationData.isDealer) {
    const _position = await getLocation(
      registrationData.street,
      registrationData.houseNumber,
      registrationData.city,
      registrationData.zip
    );

    if (!_position) {
      return "Adresse ist ungültig";
    }

    position = _position;
  }

  let payload = {
    isDealer: registrationData.isDealer,
    defaultCategory: registrationData.defaultCategory,
    street: registrationData.street,
    houseNumber: registrationData.houseNumber,
    city: registrationData.city,
    zip: registrationData.zip,
    phone: registrationData.phone,
    username: registrationData.username,
    email: registrationData.email,
    age: registrationData.age,
    gender: registrationData.gender,
    taxId: registrationData.taxId,
    location: toPostGisPoint(position)
  };

  const { error } = await supabase.auth.signUp({
    email: registrationData.email,
    password: registrationData.password,
    options: {
      data: payload
    }
  });

  if (error) {
    return translateError(error);
  }
}
