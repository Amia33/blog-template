import "server-only";

const BASE_HEADERS = {
  "Cache-Control": "private, no-store",
  "X-Content-Type-Options": "nosniff",
};

export function protectedError(status: number, message: string): Response {
  return new Response(message, {
    status,
    headers: {
      ...BASE_HEADERS,
      "Content-Type": "text/plain; charset=utf-8",
      ...(status === 503 ? { "Retry-After": "60" } : {}),
    },
  });
}

export function protectedFile(data: BodyInit, contentType: string): Response {
  return new Response(data, {
    headers: {
      ...BASE_HEADERS,
      "Content-Type": contentType,
    },
  });
}
