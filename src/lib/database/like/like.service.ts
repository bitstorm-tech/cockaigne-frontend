import type { Like } from "$lib/database/like/like.model";
import pool from "$lib/database/pg";

export async function insertLike(userId: number, dealId: number) {
  const query = `INSERT INTO "like" (user_id, deal_id)
                 VALUES ($1, $2)`;
  const values = [userId, dealId];

  await pool.query(query, values);
}

export async function findLike(userId: number, dealId: number): Promise<Like | undefined> {
  const query = `SELECT *
                 FROM "like"
                 WHERE user_id = $1
                   AND deal_id = $2`;
  const values = [userId, dealId];

  const result = await pool.query<Like>(query, values);

  if (result.rows.length === 0) {
    console.log("No like found for account_id=%s and deal_id=%s", userId, dealId);
    return;
  }

  return result.rows[0];
}

export async function findLikedDealsIds(accountId: number): Promise<number[]> {
  const query = `SELECT deal_id
                 FROM "like"
                 WHERE user_id = $1`;
  const values = [accountId];

  const result = await pool.query<Like>(query, values);

  return result.rows.map((like) => like.deal_id);
}

export async function deleteLike(userId: number, dealId: number) {
  const query = `DELETE
                 FROM "like"
                 WHERE user_id = $1
                   AND deal_id = $2`;
  const values = [userId, dealId];

  await pool.query(query, values);
}

export async function getLikeCount(dealId: number): Promise<number> {
  const query = "SELECT likes FROM like_count WHERE deal_id = $1";
  const values = [dealId];

  const result = await pool.query(query, values);

  if (result.rows.length === 0) {
    return 0;
  }

  return result.rows[0].likes;
}
