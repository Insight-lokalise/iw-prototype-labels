import {getCurrentLocale} from "@insight/toolkit-utils";
import {INSIGHT_CURRENT_LOCALE_COOKIE_NAME} from "@constants";

export const getCountryCode = () => {
    const currentLocale = getCurrentLocale(INSIGHT_CURRENT_LOCALE_COOKIE_NAME)
    return currentLocale.split("_")[1].toUpperCase()
}