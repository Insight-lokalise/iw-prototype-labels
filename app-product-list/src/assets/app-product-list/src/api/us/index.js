import {
  axios,
  GET,
  getUserInformation,
  getAllFeatureFlags,
} from 'app-api-user-service'
import setToolkitLabels from '@insight/toolkit-react/lib/utils/setToolkitLabels'
import {
  i18n,
  l,
  getCurrentLocale,
  getDefaultLoggedOutSalesOrg,
} from '@insight/toolkit-utils'
import { getCountryCode } from '../../lib/helpers'

export const INSIGHT_LOCALE_COOKIE_NAME = 'insight_current_locale'

export function fetchProductListConfig(componentPath) {
  return axios
    .get(`/aemServices/exporter?componentPath=${componentPath}`)
    .catch((error) => {
      console.warn('Failed to load product list data from AEM dialog', error)
      throw error
    })
}

/** Compare products service
 *
 * This old api used for None-CES experience
 *
 * @param {Object} data
 * @returns
 */
export function fetchProductListData(data) {
  return axios
    .post(`/insightweb/compareProducts`, data, {
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
    })
    .catch((error) => {
      console.warn('Failed to load product list data from AEM dialog', error)
      throw error
    })
}

/** Compare products micro-service
 *
 * This is the new api to get product info and prices when user has CES experience (default logged-out or CES logged-in)
 * @param {string} q - List of SKUs seperated with encoded pipe(|) character(%7)
 */
export const getComparedProducts = async (q) => {
  const { userInformation, isLoggedIn, sessionId, locale, isIpsLogo } =
    await getSessionUser()

  const cdmUid = userInformation?.cdmUid
  const country = getCountryCode()
  const currencyCode = userInformation?.currencyCode
  const salesOrg =
    userInformation?.salesOrg || getDefaultLoggedOutSalesOrg(locale, isIpsLogo)
  const soldTo = userInformation?.account?.soldToId
  const webGroupId = userInformation?.webGroup?.webGroupId
  const lang = l() === 'en_CA' ? 'en_US' : l()
  const params = !isLoggedIn
    ? { q, sessionId, country, userSegment: 'CES', salesOrg, lang, locale }
    : {
        q,
        userId: cdmUid,
        userSegment: 'CES',
        sessionId,
        country,
        lang,
        currencyCode,
        salesOrg,
        soldTo,
        webGroupId,
        locale,
      }

  try {
    const { data } = await axios({
      method: GET,
      url: `/gapi/product-search/compare`,
      params,
    })
    if (!data) throw new Error('Error finding compared products')
    return data
  } catch (err) {
    if (err.response?.data?.message) err = new Error(err.response.data.message)
    console.warn(`Failed to fetch compared products`, err)
    throw err
  }
}

export function getTranslations() {
  const locale = getCurrentLocale(INSIGHT_LOCALE_COOKIE_NAME)
  const isDebranded =
    window &&
    window.Insight &&
    window.Insight.b2bLoginInfo &&
    window.Insight.b2bLoginInfo.debrandSite
  return i18n({ app: 'app-product-list', isDebranded, locale }).then((labels) =>
    setToolkitLabels(labels)
  )
}

// Set and store initial response as a cached user
let cachedUserInfoResponse

/** Get Session User
 *
 * Get and return the data for the current active user */
export const getSessionUser = async () => {
  try {
    if (!cachedUserInfoResponse) {
      const res = await getUserInformation()
      cachedUserInfoResponse = res
      return res.data
    }
    return cachedUserInfoResponse.data
  } catch (err) {
    console.warn(`Failed to fetch user information`, err)
    throw err
  }
}

let cachedResponse

export function getFeatureFlags() {
  if (!cachedResponse) {
    cachedResponse = getAllFeatureFlags().then((data) => {
      return data
    })
  }

  return cachedResponse
}
