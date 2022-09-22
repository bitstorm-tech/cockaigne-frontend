import pool from "$lib/database/pg";
import type { Dealer } from "../dealer/dealer.model";
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
  const categories = filter.categories?.length > 0 ? `AND d.category in (${filter.categories.join(",")})` : "";

  const query = `SELECT d.*, ST_ASTEXT(a.location) AS location
                 FROM deal d,
                      account a
                 WHERE a.id = d.account_id
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

  return result.rows[0];
}

export async function findDealsByOwnerId(id: number): Promise<Deal[]> {
  const query = "SELECT * FROM deal WHERE account_id = $1 AND template = false";
  const result = await pool.query<Deal>(query, [id]);

  return result.rows;
}

export async function findFavoriteDealsByAccountId(id: number): Promise<Deal[]> {
  const result = await pool.query<Deal>(
    "SELECT d.* FROM deal d, favorite_deal f WHERE d.id = f.deal_id AND f.account_id = $1",
    [id]
  );

  return result.rows;
}

export async function findFavoriteDealersByAccountId(id: number): Promise<Dealer[]> {
  const query =
    "SELECT a.id, a.company_name FROM account a, favorite_dealer f WHERE a.id = f.dealer_id AND f.account_id = $1";
  const result = await pool.query<Dealer>(query, [id]);

  return result.rows;
}

export async function findTemplateDealsByAccountId(id: number): Promise<Deal[]> {
  const query = "SELECT * FROM deal WHERE account_id = $1 AND template is true";
  const result = await pool.query<Deal>(query, [id]);

  return result.rows;
}

export async function upsertDeal(deal: Deal) {
  const doUpdate = deal?.id > 0;
  const query = doUpdate
    ? "UPDATE deal SET account_id = $1, title = $2, description = $3, category = $4, duration = $5, start = $6, template = $7 WHERE id = $8"
    : "INSERT INTO deal (account_id, title, description, category, duration, start, template) VALUES ($1, $2, $3, $4, $5, $6, $7)";

  const values = [deal.account_id, deal.title, deal.description, deal.category, deal.duration, deal.start, false];

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
