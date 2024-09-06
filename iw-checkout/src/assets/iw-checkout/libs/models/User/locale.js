import { getCookie } from '@insight/toolkit-utils/lib/helpers/cookieHelpers'

//product urls will use domain cookie for EMEA for now
export function currentLocale() {
    return getCookie("insight_locale");
}
