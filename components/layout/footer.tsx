import CopyrightYear from "@/components/ui/copyright-year";
import { profileConfig } from "@/lib/config";
import { t } from "@/lib/strings";

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-dashed border-base-300 pt-6 pb-2 text-center text-sm opacity-80">
      <p>
        &copy; <CopyrightYear /> {profileConfig.name}. {t("allRightsReserved")}
      </p>
      <p className="mt-1">
        {t("poweredBy")}{" "}
        <a
          className="link link-primary"
          href="https://nextjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Next.js
        </a>{" "}
        &amp;{" "}
        <a
          className="link link-primary"
          href="https://github.com/saicaca/fuwari"
          target="_blank"
          rel="noopener noreferrer"
        >
          Fuwari
        </a>
      </p>
    </footer>
  );
}
