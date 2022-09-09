import { GET } from "$lib/http.service";

export async function load() {
  const response = await GET("/api/categories");

  if (response.ok) {
    const categories = await response.json();

    return {
      categories
    };
  }
}
