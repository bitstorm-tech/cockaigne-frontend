import pool from "$lib/database/pg";
import type { Deal } from "./deal.model";

export async function findAllDeals(): Promise<Deal[]> {
  const result = await pool.query("SELECT * FROM Deal");
  return result.rows;
}

export async function findDealById(id: number): Promise<Deal | undefined> {
  return;
}

export async function upsertDeal(deal: Deal) {}
