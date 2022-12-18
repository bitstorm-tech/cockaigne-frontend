import pool from "$lib/database/pg";
import { enrichStartTimestampWithTimezone } from "$lib/deal.utils";
import type { Deal, DealFilter } from "./deal.model";

function createFilterQuery(filter: DealFilter): string | undefined {
  const filterBaseQuery = `
    SELECT d.*, a.company_name, ST_ASTEXT(a.location) AS location, c.likes
    FROM deal d
    JOIN account a ON d.dealer_id = a.id
    LEFT JOIN like_count c ON c.deal_id = d.id
    WHERE a.id = d.dealer_id
      AND d.template = false
      AND now() between d."start" and d."start" + (d."duration" || ' hours')::interval
      AND ST_WITHIN(a.location, #extent)
      #category_ids
      #order_by
      #limit
  `.trim();
  const extent = createExtentCondition(filter);

  if (!extent) {
    return;
  }

  const categories =
    filter.categoryIds && filter.categoryIds.length > 0 ? `AND d.category_id in (${filter.categoryIds.join(",")})` : "";
  const limit = filter.limit ? `LIMIT ${filter.limit}` : "";
  const orderBy = filter.orderBy ? `ORDER BY ${filter.orderBy} NULLS LAST` : "";

  return filterBaseQuery
    .replace("#extent", extent)
    .replace("#category_ids", categories)
    .replace("#order_by", orderBy)
    .replace("#limit", limit);
}

export async function findDealsByFilter(filter: DealFilter): Promise<Deal[]> {
  const query = createFilterQuery(filter);

  if (!query) {
    return [];
  }

  const result = await pool.query<Deal>(query);

  return result.rows;
}

function createExtentCondition(filter: DealFilter): string | undefined {
  if (filter.location && filter.radius) {
    const point = `ST_POINT(${filter.location.longitude}, ${filter.location.latitude})::geography`;
    return `ST_BUFFER(${point}, ${filter.radius})::geometry`;
  }

  if (filter.extent) {
    const pointMin = `ST_POINT(${filter.extent[0]}, ${filter.extent[1]})::geography::geometry`;
    const pointMax = `ST_POINT(${filter.extent[2]}, ${filter.extent[3]})::geography::geometry`;
    return `ST_ENVELOPE(ST_MAKELINE(${pointMin}, ${pointMax}))::geometry`;
  }

  console.warn("Can't create extent statement: neither location/radius nor extent is given");
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

  return result.rows; //.map(enrichStartTimestampWithTimezone);
}

export async function findTemplateDealsByDealerId(dealerId: number): Promise<Deal[]> {
  const query = "SELECT * FROM deal WHERE dealer_id = $1 AND template is true";
  const result = await pool.query<Deal>(query, [dealerId]);

  return result.rows.map(enrichStartTimestampWithTimezone);
}

export async function upsertDeal(deal: Deal): Promise<number> {
  const doUpdate = deal?.id > 0;
  const query = doUpdate
    ? "UPDATE deal SET dealer_id = $1, title = $2, description = $3, category_id = $4, duration = $5, start = to_timestamp($6), template = $7 WHERE id = $8 RETURNING id"
    : "INSERT INTO deal (dealer_id, title, description, category_id, duration, start, template) VALUES ($1, $2, $3, $4, $5, to_timestamp($6), $7) RETURNING id";

  const values = [deal.dealer_id, deal.title, deal.description, deal.category_id, deal.duration, deal.start, false];

  if (doUpdate) {
    values.push(deal.id);
  }

  const result = await pool.query<Deal>(query, values);
  if (deal.template) {
    values[6] = true;
    await pool.query<Deal>(query, values);
  }

  return result.rows[0].id;
}

export async function deleteDealById(id: number) {
  const query = "DELETE FROM deal WHERE id = $1";
  await pool.query(query, [id]);
}
