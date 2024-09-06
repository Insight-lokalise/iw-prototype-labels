import axios, { GET, POST } from './axios'
import { getSessionUser } from './getSessionUser'
import { getLocaleMetadata } from '../lib/locale'
import { getCurrentLocale } from '@insight/toolkit-utils/lib/helpers'
import { getDefaultLoggedOutSalesOrg } from '@insight/toolkit-utils'
import { addFieldsForHybridX } from 'app-api-user-service'

/** Get Product Information API - Used for mini PDP
 *
 * Get product information using the provided options
 * @param {string} materialId - Unique product id
 */

export const getProductDetailCompare = async ({ materialId }) => {
  const { userInformation, isLoggedIn, sessionId, isIpsLogo } =
    await getSessionUser()
  const {
    webLoginProfileId,
    currencyCode,
    account: { soldToId: soldTo } = {},
    webGroup: { webGroupId } = {},
    salesOrg: origSalesOrg,
    UserType: userType,
    isCES,
    defConsortiaId: consortiaId,
  } = userInformation || {}
  const localeMetadata = getLocaleMetadata()
  const locale = getCurrentLocale('insight_current_locale')
  const salesOrg = origSalesOrg || getDefaultLoggedOutSalesOrg(locale, isIpsLogo)
  const defaultParams = {
    q: decodeURIComponent(materialId),
    country: localeMetadata.market,
    lang: locale === 'en_CA' ? 'en_US' : locale,
    userSegment: 'CES',
    salesOrg,
    sessionId,
    locale,
  }
  const params = !isLoggedIn
    ? defaultParams
    : { 
      ...defaultParams, 
      userId: webLoginProfileId, 
      currencyCode, 
      soldTo, 
      webGroup: webGroupId,
      ...(consortiaId && {consortiaId})
     }

  const isHybridEnabled = await addFieldsForHybridX({isLoggedIn, isCES}, params, {userType})
  if(isHybridEnabled) {
    try {
      const { data } = await axios({
        method: POST,
        url: `/gapi/product-search/compare`,
        data: {...params}
      })
      return data
    } catch (err) {
      console.warn(`Failed to fetch product search information`, err)
      throw err
    }
  }

  try {
    const { data } = await axios({
      method: GET,
      url: '/gapi/product-search/compare',
      params,
    })
    return data
  } catch (err) {
    console.warn(`Failed to fetch PDP information`, err)
    throw err
  }
}

export default getProductDetailCompare
