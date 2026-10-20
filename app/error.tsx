"use client";

import Link from "next/link";
import { useEffect } from "react";

import { t } from "@/lib/strings";

export default function Error({
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
    <main className="mx-auto flex min-h-[60vh] w-full max-w-xl flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <h1 className="text-2xl font-bold">{t("errorTitle")}</h1>
      <p className="opacity-70">{t("errorDescription")}</p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button type="button" className="btn btn-primary" onClick={reset}>
          {t("retry")}
        </button>
        <Link href="/" className="btn">
          {t("backHome")}
        </Link>
      </div>
    </main>
  );
}
