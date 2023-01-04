import type { Report } from "$lib/database/report/report.model";
import { findReportByReporterIdAndDealId, insertReport } from "$lib/database/report/report.service";
import { errorResponse, response, unauthorizedResponse } from "$lib/http.utils";
import { extractJwt } from "$lib/jwt.utils";
import type { RequestEvent } from "@sveltejs/kit";

export async function POST({ request }: RequestEvent) {
  try {
    const jwt = await extractJwt(request);

    if (!jwt || !jwt.sub) {
      return unauthorizedResponse();
    }

    const report: Report = await request.json();
    report.reporter_id = +jwt.sub;

    await insertReport(report);

    return response();
  } catch (error) {
    console.error("Can't post report:", error);
    return errorResponse();
  }
}

export async function GET({ request, url }: RequestEvent) {
  try {
    const jwt = await extractJwt(request);

    if (!jwt || !jwt.sub) {
      return unauthorizedResponse();
    }

    const dealId = url.searchParams.get("dealId") || 0;
    const report = await findReportByReporterIdAndDealId(+jwt.sub, +dealId);

    return response(report || {});
  } catch (error) {
    console.error("Can't post report:", error);
    return errorResponse();
  }
}
