import pool from "../pg";
import type { Rating } from "./rating.model";

export async function findRatingsByDealerId(dealerId: number): Promise<Rating[]> {
  const query = "SELECT * FROM dealer_rating WHERE dealer_id = $1 ORDER BY created DESC";
  const result = await pool.query<Rating>(query, [dealerId]);

  return result.rows;
}

export async function insertRating(rating: Rating): Promise<Rating | undefined> {
  const query =
    "INSERT INTO dealer_rating (account_id, dealer_id, stars, rating_text) VALUES ($1, $2, $3, $4) RETURNING *";
  const values = [rating.account_id, rating.dealer_id, rating.stars, rating.rating_text];
  const result = await pool.query<Rating>(query, values);

  return result.rows[0];
}

export async function alreadyRated(accountId: number, dealerId: number): Promise<boolean> {
  const query = "SELECT EXISTS(SELECT * FROM dealer_rating WHERE account_id = $1 AND dealer_id = $2)";
  const result = await pool.query(query, [accountId, dealerId]);

  return result.rows[0].exists > 0;
}
