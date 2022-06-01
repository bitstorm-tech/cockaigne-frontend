import pool from "$lib/database/pg";
import type { Deal } from "./deal.model";

export async function findAllDeals(): Promise<Deal[]> {
  const result = await pool.query("SELECT * FROM Deal");
  return result.rows;
}

export async function findDealById(id: number): Promise<Deal | undefined> {
  const result = await pool.query<Deal>("SELECT * FROM deal WHERE id = $1", [id]);

  if (result.rows.length === 0) {
    console.warn("Can't find deal with id:", id);
    return;
  }

  return result.rows[0];
}

export async function upsertDeal(deal: Deal) {
  const query = deal.id
    ? "UPDATE deal SET account_id = $2, title = $3, description = $4, category = $5, duration = $6, start = $7 WHERE id = $1"
    : "INSERT INTO deal (account_id, title, description, category, duration, start) VALUES ($1, $2, $3, $4, $5, $6)";

  const values = [deal.account_id, deal.title, deal.description, deal.category, deal.duration, deal.start];

  if (deal.id) {
    values.unshift(deal.id);
  }

  await pool.query<Deal>(query, values);
}
