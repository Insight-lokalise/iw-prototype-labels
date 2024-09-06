
import { getCountryCode } from '../../lib/helpers'
import { l } from '@insight/toolkit-utils'
import { getSessionUser } from '../api/getSessionUser'
import { getDefaultLoggedOutSalesOrg } from '@insight/toolkit-utils'
import { getCookie, hasCookie } from '@insight/toolkit-utils/lib/helpers/cookieHelpers'
import { IPS_CONTRACT_ID_COOKIE_NAME, IPS_CONTRACT_NAME_COOKIE_NAME } from '../constants'

export const createPayloadForCompareApi = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const q = urlParams.get('q')
  const { userInformation, isLoggedIn, sessionId, locale, isIpsLogo } = await getSessionUser()
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

  const country = getCountryCode()
  const salesOrg = origSalesOrg || getDefaultLoggedOutSalesOrg(locale, isIpsLogo)
  const lang = l() === 'en_CA' ? 'en_US' : l()

  // IPS user
  const isIPSUser = (isLoggedIn && userInformation?.isIpsUser) || isIpsLogo
  const loginContract = isIPSUser && isLoggedIn ? userInformation?.contract : null
  const ipsContractID = hasCookie(IPS_CONTRACT_ID_COOKIE_NAME) ? getCookie(IPS_CONTRACT_ID_COOKIE_NAME) : null
  const ipsContractName = hasCookie(IPS_CONTRACT_NAME_COOKIE_NAME) ? getCookie(IPS_CONTRACT_NAME_COOKIE_NAME) : null
  const logoutContract = isIPSUser && ipsContractID && !isLoggedIn ? {
    name: ipsContractName,
    contractType: decodeURIComponent(decodeURIComponent(ipsContractName)),
    contractId: decodeURIComponent(decodeURIComponent(ipsContractID))
  } : null
  const contract = isIPSUser ? (loginContract || logoutContract) : null
  const setIPSParams = {
    "contractType": contract?.contractType === "Open market" ? "openMarket" : contract?.contractType,
    "contractId": (contract?.contractType === 'All' || contract?.contractType === 'Open market') ? null : contract?.contractId,
    "nonLoggedInIpsUser": !isLoggedIn,
    "ipsUser": isIPSUser
  }
  const ipsParams = isIPSUser ? setIPSParams : null
  const params = !isLoggedIn
    ? { q, sessionId, country, userSegment: 'CES', salesOrg, lang, locale, ...ipsParams }
    : {
      q,
      userId: webLoginProfileId,
      userSegment: 'CES',
      sessionId,
      country,
      lang,
      currencyCode,
      salesOrg,
      soldTo,
      locale,
      webGroup: webGroupId,
      ...ipsParams,
      ...(consortiaId && { consortiaId })
    }

  return { params, isLoggedIn, isCES, userType }
}
