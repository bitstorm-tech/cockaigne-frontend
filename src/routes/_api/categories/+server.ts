import { findAllCategories } from "$lib/database/category/category.service";
import { errorResponse, response } from "$lib/http.utils";

export async function GET() {
  try {
    const categories = await findAllCategories();
    return response(categories);
  } catch (error) {
    console.error("Can't get categories:", error);
    return errorResponse();
  }
}
