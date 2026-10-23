const MAX_BODY_SIZE = 16 * 1024;
const MAX_REPORTS = 20;

type Report = Record<string, unknown>;

function isRecord(value: unknown): value is Report {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function asNumber(value: unknown): number | undefined {
  return typeof value === "number" ? value : undefined;
}

function toReports(payload: unknown): Report[] {
  const entries = Array.isArray(payload) ? payload : [payload];

  return entries
    .flatMap((entry) => {
      if (!isRecord(entry)) return [];

      const body = isRecord(entry.body) ? entry.body : entry["csp-report"];

      return [isRecord(body) ? body : entry];
    })
    .slice(0, MAX_REPORTS);
}

function describe(report: Report) {
  const sample = asString(report["script-sample"]) ?? asString(report.sample);

  return {
    document: asString(report["document-uri"]) ?? asString(report.documentURL),
    directive:
      asString(report["violated-directive"]) ??
      asString(report.effectiveDirective),
    blocked: asString(report["blocked-uri"]) ?? asString(report.blockedURL),
    source: asString(report["source-file"]) ?? asString(report.sourceFile),
    line: asNumber(report["line-number"]) ?? asNumber(report.lineNumber),
    sample: sample?.slice(0, 200),
    disposition: asString(report.disposition),
  };
}

export async function POST(request: Request) {
  const body = await request.text();

  if (body.length > MAX_BODY_SIZE) {
    return new Response(null, { status: 413 });
  }

  let payload: unknown;

  try {
    payload = JSON.parse(body);
  } catch {
    return new Response(null, { status: 400 });
  }

  for (const report of toReports(payload)) {
    console.warn("[csp-report]", JSON.stringify(describe(report)));
  }

  return new Response(null, { status: 204 });
}
