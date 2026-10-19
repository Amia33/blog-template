import Link from "next/link";

import PageShell from "@/components/layout/page-shell";
import { Icon } from "@/components/ui/icon";
import { t } from "@/lib/strings";

export const metadata = {
  title: t("pageNotFound"),
};

export default function NotFound() {
  return (
    <PageShell page="notFound">
      <div className="relative overflow-hidden card bg-base-100 p-8 text-center md:p-12">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center text-[8rem] font-black opacity-5 select-none"
        >
          404
        </span>
        <Icon
          name="search"
          className="relative mx-auto mb-4 text-5xl text-primary"
        />
        <h1 className="relative text-2xl font-bold">{t("pageNotFound")}</h1>
        <p className="relative mt-2 opacity-60">
          {t("pageNotFoundDescription")}
        </p>
        <div className="relative mt-6 flex flex-wrap justify-center gap-2">
          <Link href="/" className="btn btn-primary">
            <Icon name="home" className="text-lg" />
            {t("backHome")}
          </Link>
          <Link href="/archive" className="btn">
            <Icon name="archive" className="text-lg" />
            {t("goToArchive")}
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
