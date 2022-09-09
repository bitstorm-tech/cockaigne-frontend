import pool from "../pg";
import type { Category } from "./category.model";

export async function findAllCategories(): Promise<Category[]> {
  const query = "SELECT * FROM category";
  const result = await pool.query<Category>(query);

  return result.rows;
}
