import pool from "../pg";
import type { Dealer } from "./dealer.model";

export async function findFavoriteDealersByUserId(userId: number): Promise<Dealer[]> {
  const query = "SELECT a.id, a.username FROM account a, favorite_dealer f WHERE f.user_id = $1 AND a.id = f.dealer_id";
  const values = [userId];

  const result = await pool.query<Dealer>(query, values);
  return result.rows;
}

export async function insertFavoriteDealer(userId: number, dealerId: number) {
  const query = "INSERT INTO favorite_dealer (user_id, dealer_id) VALUES ($1, $2)";
  const values = [userId, dealerId];
  await pool.query(query, values);
}

export async function deleteFavoriteDealer(userId: number, dealerId: number) {
  const query = "DELETE FROM favorite_dealer WHERE user_id = $1 AND dealer_id = $2";
  const values = [userId, dealerId];
  await pool.query(query, values);
}

export async function toggleFavoriteDealer(userId: number, dealerId: number): Promise<Dealer[]> {
  const query = "SELECT EXISTS(SELECT * FROM favorite_dealer WHERE user_id = $1 AND dealer_id = $2)";
  const result = await pool.query(query, [userId, dealerId]);

  const isFavorite = +result.rows[0].exists;

  const insertOrDeleteFavoriteDealer = isFavorite ? deleteFavoriteDealer : insertFavoriteDealer;
  await insertOrDeleteFavoriteDealer(userId, dealerId);

  return await findFavoriteDealersByUserId(userId);
}
