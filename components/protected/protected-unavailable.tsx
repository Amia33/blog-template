import { Icon } from "@/components/ui/icon";
import { t } from "@/lib/strings";

export default function ProtectedUnavailable() {
  return (
    <section className="alert alert-warning items-start">
      <Icon name="lock" className="mt-0.5 text-lg" />
      <div>
        <h2 className="font-bold">{t("protectedUnavailable")}</h2>
        <p className="text-sm opacity-80">
          {t("protectedUnavailableDescription")}
        </p>
      </div>
    </section>
  );
}
