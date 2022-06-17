import pool from "$lib/database/pg";
import type { Deal } from "../deal/deal.model";

export async function insertLike(accountId: number, dealId: number) {
  const query = `INSERT INTO "like" (account_id, deal_id) VALUES ($1, $2)`;
  const values = [accountId, dealId];

  await pool.query(query, values);
}

export async function findLikeByAccountIdAndDealId(accountId: number, dealId: number): Promise<Deal | undefined> {
  const query = `SELECT * FROM "like" WHERE account_id = $1 AND deal_id = $2`;
  const values = [accountId, dealId];

  const result = await pool.query<Deal>(query, values);

  if (result.rows.length === 0) {
    console.log("No like found for account_id=%s and deal_id=%s", accountId, dealId);
    return;
  }

  return result.rows[0];
}

export async function deleteLikeById(id: number) {
  const query = `DELETE FROM "like" WHERE id = $1`;
  const values = [id];

  await pool.query(query, values);
}

export async function getLikeCountByDealId(dealId: number): Promise<number> {
  const query = `SELECT COUNT(*) FROM "like" WHERE deal_id = $1`;
  const values = [dealId];

  const result = await pool.query(query, values);

  return result.rows[0].count;
}
