import setToolkitLabels from "@insight/toolkit-react/lib/utils/setToolkitLabels";
import { i18n, getCurrentLocale } from "@insight/toolkit-utils";

export function getTranslations() {
  const locale = getCurrentLocale("insight_current_locale", "insight_locale");
  const isDebranded =
    window &&
    window.Insight &&
    window.Insight.b2bLoginInfo &&
    window.Insight.b2bLoginInfo.debrandSite;
  return i18n({ app: "app-business-review", isDebranded, locale }).then(
    (labels) => setToolkitLabels(labels)
  );
}
