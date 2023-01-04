import pool from "$lib/database/pg";
import type { Report } from "$lib/database/report/report.model";

export async function insertReport(report: Report) {
  const query = "INSERT INTO reported_deal (reporter_id, deal_id, reason) VALUES ($1, $2, $3)";
  const values = [report.reporter_id, report.deal_id, report.reason];

  await pool.query(query, values);
}

export async function findReportByReporterIdAndDealId(reporterId: number, dealId: number): Promise<Report | undefined> {
  const query = "SELECT * FROM reported_deal WHERE reporter_id = $1 AND deal_id = $2";
  const values = [reporterId, dealId];

  const result = await pool.query<Report>(query, values);

  if (result.rows.length === 0) {
    return;
  }

  return result.rows[0];
}
