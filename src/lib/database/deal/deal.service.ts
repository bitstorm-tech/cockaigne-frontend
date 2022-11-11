import pool from "$lib/database/pg";
import { enrichStartTimestampWithTimezone } from "$lib/deal.service";
import { getLikeCountByDealId } from "../like/like.service";
import type { Deal, DealFilter } from "./deal.model";

export async function findAllDeals(): Promise<Deal[]> {
  const result = await pool.query<Deal>("SELECT * FROM Deal WHERE template = false");
  const deals: Deal[] = [];

  for (const deal of result.rows) {
    deal.likes = await getLikeCountByDealId(deal.id);
    deals.push(deal);
  }

  return deals;
}

export async function findDealsByFilter(filter: DealFilter): Promise<Deal[]> {
  const point = `ST_POINT(${filter.location.longitude}, ${filter.location.latitude})::geography`;
  const buffer = `ST_BUFFER(${point}, ${filter.radius})::geometry`;
  const isActive = `now() between d."start" and d."start" + (d."duration" || ' hours')::interval`;
  const categories = filter.categoryIds?.length > 0 ? `AND d.category_id in (${filter.categoryIds.join(",")})` : "";

  const query = `SELECT d.*, a.company_name, ST_ASTEXT(a.location) AS location
                 FROM deal d,
                      account a
                 WHERE a.id = d.dealer_id
                   AND d.template = false
                   AND ST_WITHIN(a.location, ${buffer})
                   AND ${isActive} ${categories}`;

  const result = await pool.query<Deal>(query);

  return result.rows;
}

export async function findDealById(id: number): Promise<Deal | undefined> {
  const result = await pool.query<Deal>("SELECT * FROM deal WHERE id = $1", [id]);

  if (result.rows.length === 0) {
    console.warn("Can't find deal with id:", id);
    return;
  }

  return enrichStartTimestampWithTimezone(result.rows[0]);
}

export async function findDealsByDealerId(dealerId: number): Promise<Deal[]> {
  const query = "SELECT * FROM deal WHERE dealer_id = $1 AND template = false";
  const result = await pool.query<Deal>(query, [dealerId]);

  return result.rows.map(enrichStartTimestampWithTimezone);
}

export async function findHotDealsByUserId(userId: number): Promise<Deal[]> {
  const result = await pool.query<Deal>(
    "SELECT d.* FROM deal d, hot_deal h WHERE d.id = h.deal_id AND h.user_id = $1",
    [userId]
  );

  return result.rows.map(enrichStartTimestampWithTimezone);
}

export async function findTemplateDealsByDealerId(dealerId: number): Promise<Deal[]> {
  const query = "SELECT * FROM deal WHERE dealer_id = $1 AND template is true";
  const result = await pool.query<Deal>(query, [dealerId]);

  return result.rows.map(enrichStartTimestampWithTimezone);
}

export async function upsertDeal(deal: Deal) {
  const doUpdate = deal?.id > 0;
  const query = doUpdate
    ? "UPDATE deal SET dealer_id = $1, title = $2, description = $3, category_id = $4, duration = $5, start = to_timestamp($6), template = $7 WHERE id = $8"
    : "INSERT INTO deal (dealer_id, title, description, category_id, duration, start, template) VALUES ($1, $2, $3, $4, $5, to_timestamp($6), $7)";

  const values = [deal.dealer_id, deal.title, deal.description, deal.category_id, deal.duration, deal.start, false];

  if (doUpdate) {
    values.push(deal.id);
  }

  await pool.query<Deal>(query, values);
  if (deal.template) {
    values[6] = true;
    await pool.query<Deal>(query, values);
  }
}

export async function deleteDealById(id: number) {
  const query = "DELETE FROM deal WHERE id = $1";
  await pool.query(query, [id]);
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
