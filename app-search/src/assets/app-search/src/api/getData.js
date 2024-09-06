import { addFieldsForHybridX, isHybridXEnabled, getUserInformation } from 'app-api-user-service';
import { getDefaultLoggedOutSalesOrg } from '@insight/toolkit-utils';
import { flatPermissions } from '../lib/flatPermission';
import axios, { GET, POST } from './axiosConfig';
import { solutionProductTile } from '../constants'

import {
  getSessionUser,
  getContractDetils
} from '../api';

export const fetchSearch = async (queryString) => {
  const { userInformation, isLoggedIn, sessionId } = await getSessionUser()

  const webLoginProfileId = userInformation?.webLoginProfileId;
  const soldTo = userInformation?.account?.soldToId;
  const webGroupId = userInformation?.webGroup?.webGroupId;
  const userSegment = 'CES'; // This value is nothing to do with CES as we understand it, but it's how we need to mark data coming from the web for consumption by lucidworks (for all sales orgs)

  const defaultUrl = `gapi/product-search/search?${queryString}&userSegment=${userSegment}&sessionId=${encodeURIComponent(
    sessionId
  )}`
  const url = !isLoggedIn
    ? defaultUrl
    : (soldTo && webGroupId) ? `${defaultUrl}&userId=${webLoginProfileId}&soldTo=${soldTo}&webGroupId=${webGroupId}` : `${defaultUrl}&userId=${webLoginProfileId}`
  return axios({
    method: GET,
    url,
  }).catch((error) => console.warn('Error getting products: ' + error))
}

export const fetchContentSearch = async ({ searchText, locale, salesOrg }) => {
  const country = locale.split('_')[1]
  const url = 'gapi/product-search/solutionsSearch'
  return axios({
    method: GET,
    url,
    params:{
      q: searchText,
      lang: locale,
      locale,
      salesOrg,
      country,
      rows: solutionProductTile.defaultTileCount,
      start: 0
    }
  }).catch((error) => {
    console.warn('Error getting content search: ' + error)
    return { data: {} }
  })
}

export const fetchAEMContent = ({
  searchText,
  searchPaths,
  pageSize,
  currentPage = 1,
}) => {
  return axios({
    method: GET,
    url: '/aemServices/contentSearch',
    params: { searchText, searchPaths, pageSize, currentPage },
  }).catch((error) => console.warn('Error getting AEM items: ' + error))
}

export const fetchSolutionsAndServices = (params = {}) => {
  //Fetch the data for the current selected page
  return axios({
    method: GET,
    url: `gapi/product-search/solutionsSearch`,
    params
  }).catch((error) =>
    console.warn('Error getting solutions & services: ' + error)
  )
}

let cachedUserInfoResponse
export function getAccountInformation() {
  if (!cachedUserInfoResponse) {
    cachedUserInfoResponse = getUserInformation().then(({ data }) => {
        const isIPSUser =
          (data.isLoggedIn && data.userInformation.isIpsUser) || data.isIpsLogo
        const isCES = data.isLoggedIn ? data.userInformation.isCES : false
        return {
          cdmUid: (data.isLoggedIn && data.userInformation.cdmUid) || null,
          currencyCode:
            (data.isLoggedIn && data.userInformation.currencyCode) || null,
          domainUrl: data.domainUrl,
          isLoggedIn: data.isLoggedIn,
          isIPSUser,
          webGroupId:
            (data.isLoggedIn && data.userInformation.webGroup.webGroupId) || null,
          salesOrg:
            (data.isLoggedIn && data.userInformation.salesOrg) ||
            getDefaultLoggedOutSalesOrg(data.locale, isIPSUser),
          sessionId: data.sessionId,
          isHybridXEnabled: isHybridXEnabled(data.isLoggedIn, isCES),
          permissions: flatPermissions(data.isLoggedIn ? data.userInformation.permissions : null),
          webGroupPermissions: (data.isLoggedIn && data.userInformation.webGroupPermissions) || [],
          showProductImages: data.isLoggedIn ? data.userInformation.showProductImages : true,
          contract: data.isLoggedIn ? data.userInformation.contract : null
        }
    })
  }
  return cachedUserInfoResponse
}

export function getCart() {
  const timestamp = new Date().getTime()
  return axios({
    method: GET,
    url: `insightweb/transaction/getcart?_=${timestamp}`,
  }).catch((error) => {
    console.warn('Error getting old cart: ' + error)
    throw error
  })
}

export const getProductSearch = async (queryString) => {
  const { userInformation, isLoggedIn, sessionId } = await getSessionUser()
  const {
    webLoginProfileId,
    webGroup: { webGroupId: webGroup } = {},
    account: { soldToId: soldTo } = {},
    UserType: userType,
    isCES,
    defConsortiaId: consortiaId,
  } = userInformation || {}
  const params = {}

  queryString.forEach((value, key) => {
    params[key] = value;
  })
  if (params['selectedContractIDs']) {
    const selectedContractIDs = params['selectedContractIDs'];
    params['selectedContractIDs'] = selectedContractIDs.includes(',') ? selectedContractIDs.split(',') : selectedContractIDs;
  }
  params['userSegment'] = 'CES'
  params['sessionId'] = encodeURIComponent(sessionId)

  if(isLoggedIn){
    if(soldTo && webGroup){
      params['userId'] = webLoginProfileId
      params['soldTo'] = soldTo
      params['webGroup'] = webGroup
      params['currencyCode'] = userInformation?.currencyCode
      await addFieldsForHybridX({isLoggedIn, isCES}, params, {userType})
    } else {
      params['userId'] = webLoginProfileId
    }
    if(consortiaId){
      params['consortiaId'] = consortiaId
    }
  }

  try {
    const res = await axios({
      method: POST,
      url: '/gapi/product-search/search',
      data: {
        ...params
      },
    })
    return res
  } catch (err) {
    console.warn(`Failed to fetch product search information`, err)
    throw err
  }
}
