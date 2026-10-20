"use client";

import { useEffect } from "react";

import { t } from "@/lib/strings";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="ja">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#ffffff",
          color: "#1f2937",
        }}
      >
        <main
          style={{
            maxWidth: "32rem",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>
            {t("errorTitle")}
          </h1>
          <p style={{ opacity: 0.7, marginBottom: "1.5rem" }}>
            {t("errorDescription")}
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              padding: "0.6rem 1rem",
              borderRadius: "0.5rem",
              border: "1px solid #d1d5db",
              background: "#ffffff",
              cursor: "pointer",
            }}
          >
            {t("retry")}
          </button>
        </main>
      </body>
    </html>
  );
}
