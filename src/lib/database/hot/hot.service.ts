import type { Hot } from "$lib/database/hot/hot.model";
import pool from "$lib/database/pg";

export async function findHotDealIds(userId: number): Promise<number[]> {
  const result = await pool.query<Hot>("SELECT * FROM hot_deal WHERE user_id = $1", [userId]);

  if (result.rows.length === 0) {
    return [];
  }

  return result.rows.map((hot) => hot.deal_id);
}

export async function insertHotDeal(userId: number, dealId: number) {
  const query = "INSERT INTO hot_deal (user_id, deal_id) VALUES ($1, $2)";
  const values = [userId, dealId];
  await pool.query(query, values);
}

export async function deleteHotDeal(userId: number, dealId: number) {
  const query = "DELETE FROM hot_deal WHERE user_id = $1 AND deal_id = $2";
  const values = [userId, dealId];
  await pool.query(query, values);
}
