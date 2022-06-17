import pool from "$lib/database/pg";
import type { Favorite } from "./favorite.model";

export async function findFavoritesByAccountId(accountId: number): Promise<Favorite[]> {
  const query = "SELECT * FROM favorite WHERE account_id = $1";
  const values = [accountId];

  const result = await pool.query<Favorite>(query, values);
  return result.rows;
}

export async function insertFavorite(accountId: number, dealId: number) {
  const query = "INSERT INTO favorite (account_id, deal_id) VALUES ($1, $2)";
  const values = [accountId, dealId];
  pool.query(query, values);
}

export async function deleteFavorite(accountId: number, dealId: number) {
  const query = "DELETE FROM favorite WHERE account_id = $1 AND deal_id = $2";
  const values = [accountId, dealId];
  pool.query(query, values);
}
