import { getSessionUser } from './getSessionUser'
import { getDefaultLoggedOutSalesOrg } from '@insight/toolkit-utils'
import { addFieldsForHybridX, axios } from 'app-api-user-service'

export const getLWSearch = async (queryString, params) => {
  try {
    var isInstockOnlyFlagEnabled =
      window.flags && window.flags['GNA-9998-IN-STOCK']
    const { userInformation, sessionId, locale, isIpsLogo, isLoggedIn } =
      await getSessionUser()
    const {
      webLoginProfileId,
      salesOrg,
      UserType: userType,
      webGroup: { webGroupId } = {},
      account: { soldToId: soldTo } = {},
      isCES,
    } = userInformation || {}
    const country = locale && locale.split('_')[1]
    // Get search using the query string

    const defaultParams = {
      ...params,
      q: queryString,
      instockOnly: isInstockOnlyFlagEnabled ? 'false' : 'true',
      country,
      lang: locale === 'en_CA' ? 'en_US' : locale,
      locale,
      salesOrg: salesOrg || getDefaultLoggedOutSalesOrg(locale, isIpsLogo),
      userSegment: 'CES',
      sessionId: encodeURIComponent(sessionId),
    }
    const paramsObj = !isLoggedIn
      ? defaultParams
      : (soldTo && webGroupId)?
        {
          ...defaultParams,
          userId: webLoginProfileId,
          webGroup: webGroupId,
          soldTo,
          currencyCode: userInformation?.currencyCode
        }
        :{
          ...defaultParams,
          userId: webLoginProfileId,
          currencyCode: userInformation?.currencyCode
        }

    const isHybridEnabled = await addFieldsForHybridX({isLoggedIn, isCES}, paramsObj, {userType})
    if(isHybridEnabled){
      try {
        const { data } = await axios.post(`/gapi/product-search/search`, {...paramsObj})
        return data
      } catch (err) {
        console.warn(`Failed to fetch product search information`, err)
        throw err
      }
    }

    const query = new URLSearchParams(paramsObj)
    const request = await fetch(
      `/gapi/product-search/search?${query.toString()}`
    )
    return await request.json()
  } catch (error) {
    console.warn('Error getting products: ' + error)
  }
}

export default getLWSearch
