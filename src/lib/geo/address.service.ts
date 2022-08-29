export async function getAddress(latitude: number, longitude: number): Promise<string | undefined> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
  const response = await fetch(url);

  if (response.ok) {
    const address = await response.json();
    if (!address) {
      return;
    }

    const { road, house_number, city, postcode, country } = address.address;

    return `${road} ${house_number}, ${postcode} ${city}, ${country}`;
  }

  return;
}
