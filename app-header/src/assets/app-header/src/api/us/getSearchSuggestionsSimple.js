import { getDefaultLoggedOutSalesOrg } from '@insight/toolkit-utils'
import { getSessionUser } from './getSessionUser'
import { addFieldsForHybridX, axios } from 'app-api-user-service'
import {
  CONTRACT_TYPE_ALL,
  CONTRACT_OPEN_MARKET, CONTRACT_TYPE_OPEN_MARKET,
} from "./constants";

let typeAheadController = null;
const getSearchSuggestionsSimple = async (searchTerm, contract) => {
  const { userInformation, sessionId, locale, isLoggedIn, isIpsLogo } =
    await getSessionUser()
  const suggestionsSize = 5
  const productsSize = 3
  const webLoginProfileId = userInformation?.webLoginProfileId
  const country = locale.split('_')[1]
  const lang = locale === 'en_CA' ? 'en_US' : locale
  const isIPSUser = (isLoggedIn && userInformation.isIpsUser) || isIpsLogo
  const isIPSUserWithContract = isIPSUser && !!contract
  const salesOrg =
    userInformation?.salesOrg || getDefaultLoggedOutSalesOrg(locale, isIPSUser)
  const soldTo = userInformation?.account?.soldToId
  const webGroupId = userInformation?.webGroup?.webGroupId
  const isCES = userInformation?.isCES
  const consortiaId = userInformation?.defConsortiaId
  
  const paramsObj = {}

  const defaultParams = `&country=${country}&lang=${lang}&locale=${locale}&salesOrg=${salesOrg}&productRows=${productsSize}&suggestionRows=${suggestionsSize}&userSegment=CES`
  const params = !isLoggedIn ? 
                  defaultParams : 
                  (soldTo && webGroupId) ? 
                    `${defaultParams}&soldTo=${soldTo}&webGroup=${webGroupId}&userId=${webLoginProfileId}` : 
                    `${defaultParams}&userId=${webLoginProfileId}`

  const isLoggedOutIPS = window.flags && window.flags['GNA-12345-LOGGEDOUT-E4-IPS']

  // transfer URLSearchParams into json
  // pass transfered paramsObj as payload
  // which required for POST /typeahead
  params.split('&').map(param => {
    if (!!param) {
      const [key, value] = param.split('=')
      paramsObj[key] = value
    }
  })
  if(consortiaId){
    paramsObj['consortiaId'] = consortiaId
  }
  if(typeAheadController){
    typeAheadController.abort()
    typeAheadController = null
  }
  typeAheadController = new AbortController();
  let results;
  try {
    const isHybridEnabled = await addFieldsForHybridX({ isLoggedIn, isCES }, paramsObj, { userType: userInformation?.UserType })
    if (isHybridEnabled || isIPSUserWithContract) {
      paramsObj['q'] = searchTerm
      paramsObj['sessionId'] = sessionId
      paramsObj['currencyCode'] = userInformation?.currencyCode || "USD"
      paramsObj['returnPrice'] = 'sync'

      if (isIPSUserWithContract) {
        if(isLoggedIn){
          if (userInformation?.contract?.contractType === CONTRACT_TYPE_ALL) {
            paramsObj['contractId'] = null
            paramsObj['contractType'] = CONTRACT_TYPE_ALL
          } else if (userInformation?.contract?.contractType === CONTRACT_OPEN_MARKET.displayName) {
            paramsObj['contractId'] = null
            paramsObj['contractType'] = CONTRACT_TYPE_OPEN_MARKET
          } else {
            paramsObj['contractId'] = userInformation?.contract?.contractId
            paramsObj['contractType'] = userInformation?.contract?.name
          }
        }else {
          paramsObj['contractId'] = contract?.contractId
          paramsObj['contractType'] = contract?.contractType
        }
      }
      results = axios.post(`/gapi/product-search/typeahead`, { ...paramsObj }, {
        signal: typeAheadController.signal
      }).catch((err) => {
        console.warn(`Failed to fetch typeahead information`, err)
        throw err
      }).then(({ data }) => data)
      return results
    } 
    results = axios
        .get(
            `/gapi/product-search/typeahead?q=${encodeURIComponent(
                searchTerm
            )}${params}&sessionId=${encodeURIComponent(sessionId)}`
            , { signal: typeAheadController.signal})
        .catch((error) => {
          console.warn('Failed to fetch search suggestions', error)
          throw error
        })
        .then(({ data }) => data)
    return results;
  } catch(e) {
    throw e
  }


}
export default getSearchSuggestionsSimple
