"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";

import {
  unlockAlbum,
  unlockPost,
  type UnlockState,
} from "@/app/actions/unlock";
import { Icon } from "@/components/ui/icon";
import { t } from "@/lib/strings";

const initialState: UnlockState = { ok: false };

export default function PasswordGate({
  kind,
  slug,
  hint,
  title,
}: {
  kind: "post" | "album";
  slug: string;
  hint?: string;
  title?: string;
}) {
  const action = kind === "post" ? unlockPost : unlockAlbum;
  const [state, formAction, pending] = useActionState(action, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const refreshed = useRef(false);

  useEffect(() => {
    if (state.ok && !refreshed.current) {
      refreshed.current = true;
      router.refresh();
    }
  }, [router, state.ok]);

  return (
    <section className="card bg-base-100 p-6 md:p-8">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon name="lock" className="text-xl" />
        </span>
        <div>
          <h2 className="text-lg font-bold">
            {title ||
              (kind === "post" ? t("protectedPost") : t("protectedAlbum"))}
          </h2>
          <p className="text-sm opacity-60">
            {kind === "post" ? t("protectedBody") : t("protectedAlbumBody")}
          </p>
        </div>
      </div>

      <form action={formAction} className="flex flex-col gap-3">
        <input type="hidden" name="slug" value={slug} />

        <label className="w-full">
          <span className="mb-1 block text-sm font-medium">
            {t("password")}
          </span>
          <div className="join w-full">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              disabled={pending}
              className="input input-bordered join-item w-full"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? t("hidePassword") : t("showPassword")}
              className="btn join-item btn-square"
            >
              <Icon name={showPassword ? "visibilityOff" : "visibility"} />
            </button>
          </div>
        </label>

        {hint ? (
          <p className="text-xs opacity-60">
            {t("passwordHint")}: {hint}
          </p>
        ) : null}

        <div aria-live="polite" className="min-h-5 text-sm text-error">
          {state.error ?? ""}
        </div>

        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            <Icon name="unlock" className="text-lg" />
          )}
          {pending ? t("unlocking") : t("unlock")}
        </button>
      </form>
    </section>
  );
}
