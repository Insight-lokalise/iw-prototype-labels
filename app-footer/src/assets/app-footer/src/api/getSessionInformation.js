import { getUserInformation } from 'app-api-user-service'
import { getCurrentLocale } from "@insight/toolkit-utils";
import { INSIGHT_LOCALE_COOKIE_NAME } from "./locales";

let cachedResponse

/**
 * Fetch the session information.
 */
export default function getSessionInformation() {
  const domainLocale = getCurrentLocale(INSIGHT_LOCALE_COOKIE_NAME)
  if (!cachedResponse) {
    cachedResponse = getUserInformation().then(({ data }) => {
        const result = {
          locale: domainLocale,
          isLoggedIn: false,
          isIPSUser: (data.isLoggedIn && data.userInformation.isIpsUser) || data.isIpsLogo,
        }
        if (data.userInformation) {
          result.isLoggedIn = true
        }
        return result
      })
  }

  return cachedResponse
}

