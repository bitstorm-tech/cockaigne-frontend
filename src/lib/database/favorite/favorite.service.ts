import pool from "$lib/database/pg";
import type { Dealer } from "../dealer/dealer.model";
import type { FavoriteDeal } from "./favorite.model";

export async function findFavoriteDealsByAccountId(accountId: number): Promise<FavoriteDeal[]> {
  const query = "SELECT * FROM favorite_deal WHERE account_id = $1";
  const values = [accountId];

  const result = await pool.query<FavoriteDeal>(query, values);
  return result.rows;
}

export async function findFavoriteDealersByAccountId(accountId: number): Promise<Dealer[]> {
  const query =
    "SELECT a.id, a.company_name FROM account a, favorite_dealer f WHERE f.account_id = $1 AND a.id = f.dealer_id";
  const values = [accountId];

  const result = await pool.query<Dealer>(query, values);
  return result.rows;
}

export async function insertFavoriteDeal(accountId: number, dealId: number) {
  const query = "INSERT INTO favorite_deal (account_id, deal_id) VALUES ($1, $2)";
  const values = [accountId, dealId];
  await pool.query(query, values);
}

export async function deleteFavoriteDeal(accountId: number, dealId: number) {
  const query = "DELETE FROM favorite_deal WHERE account_id = $1 AND deal_id = $2";
  const values = [accountId, dealId];
  await pool.query(query, values);
}

export async function insertFavoriteDealer(accountId: number, dealerId: number) {
  const query = "INSERT INTO favorite_dealer (account_id, dealer_id) VALUES ($1, $2)";
  const values = [accountId, dealerId];
  await pool.query(query, values);
}

export async function deleteFavoriteDealer(accountId: number, dealerId: number) {
  const query = "DELETE FROM favorite_dealer WHERE account_id = $1 AND dealer_id = $2";
  const values = [accountId, dealerId];
  await pool.query(query, values);
}

export async function toggleFavoriteDealer(accountId: number, dealerId: number): Promise<Dealer[]> {
  const query = "SELECT EXISTS(SELECT * FROM favorite_dealer WHERE account_id = $1 AND dealer_id = $2)";
  const result = await pool.query(query, [accountId, dealerId]);

  const isFavorite = +result.rows[0].exists > 0;

  const insertOrDeleteFavoriteDealer = isFavorite ? deleteFavoriteDealer : insertFavoriteDealer;
  await insertOrDeleteFavoriteDealer(accountId, dealerId);

  return await findFavoriteDealersByAccountId(accountId);
}
