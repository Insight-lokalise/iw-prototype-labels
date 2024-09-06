import { post } from '../fetch'
import axios, { POST } from '../../../app/libs/axiosConfig'
import { getProductDetails } from './productDetails'
import {
  INSIGHT_CURRENT_LOCALE_COOKIE_NAME,
  INSIGHT_LOCALE_COOKIE_NAME,
  RR_PLACEMENT_IDS,
} from '../../../app/libs/constants'
import { fetchAccessories } from './accessories'
import { addFieldsForHybridX } from 'app-api-user-service'
import { isCesOrDefaultLoggedOut } from '../../../app/libs/helpers/cesOrDefaultLoggedOut'
import {
  getDefaultLoggedOutSalesOrg,
  getCurrentLocale,
} from '@insight/toolkit-utils'

const { rr_warranties, rr_warranties_qa } = RR_PLACEMENT_IDS

const callRichRelevanceRecommendations = async (request) => {
  const {
    userInformation,
    sessionId,
    isLoggedin: loggedin,
    isIpsLogo,
  } = window.Insight
  const {
    salesOrg,
    currencyCode,
    isCES,
    webGroupId,
    soldto,
    webLoginProfileId,
  } = userInformation || {}
  const locale = getCurrentLocale(
    INSIGHT_CURRENT_LOCALE_COOKIE_NAME,
    INSIGHT_LOCALE_COOKIE_NAME
  )
  const isCESOrDefaultLoggedOut = isCesOrDefaultLoggedOut()

  if (isCESOrDefaultLoggedOut) {
    const { placementids: placementIds, ...others } = request
    const reqBody = {
      salesOrg: salesOrg || getDefaultLoggedOutSalesOrg(locale, isIpsLogo),
      currencyCode,
      locale,
      sessionId,
      placementIds,
      ...others,
      ...(loggedin &&
        soldto &&
        webGroupId && {
          soldTo: soldto,
          webGroup: webGroupId,
          userId: webLoginProfileId,
        }),
    }
    await addFieldsForHybridX({ isLoggedIn: loggedin, isCES }, reqBody)

    return axios({
      method: POST,
      url: '/gapi/product-management/getRecommendations',
      data: reqBody,
    }).then((response) => response?.data)
  } else {
    await addFieldsForHybridX({ isLoggedIn: loggedin, isCES }, request)
    return post('/insightweb/getRecommendations', request)
  }
}

export function callRichRelevanceRecommondations(request) {
  return callRichRelevanceRecommendations(request).catch(() => [])
}

// For Legacy
const getRequestForThirdPartyWarrantyLegacy = (
  webProduct,
  parentWebProduct
) => {
  const locale = getCurrentLocale(
    INSIGHT_CURRENT_LOCALE_COOKIE_NAME,
    INSIGHT_LOCALE_COOKIE_NAME
  )
  const {
    categoryId,
    materialQualifier,
    materialId,
    manufacturerName,
    productType,
    salesOrg,
    prices,
  } = webProduct
  const price = prices?.length ? prices[0].price : 0
  const {
    contractID,
    ipsUser,
    webLoginProfileId,
    soldto,
    wg = 0,
  } = parentWebProduct

  return {
    contractId: contractID || '',
    categoryCode: categoryId,
    materialQualifier,
    matId: materialId,
    manufacturerRule: manufacturerName,
    productTypeRule: productType,
    salesOrg,
    locale,
    ipsUser,
    soldto,
    uid: webLoginProfileId,
    price,
    wg,
    filterCallForPrice: true, // true will filter warranties with call for price
  }
}

function callThirdPartyWarrantiesLegacy(parentWebProduct) {
  return fetchAccessories(parentWebProduct)
    .then(({ webProduct }) => {
      const request = getRequestForThirdPartyWarrantyLegacy(
        webProduct,
        parentWebProduct
      )
      return post('/insightweb/getWarranty', request).catch(() => [])
    })
    .catch(() => [])
}

// For CES
const getRequestForThirdPartyWarrantyCES = (product, parentWebProduct) => {
  const locale = getCurrentLocale(
    INSIGHT_CURRENT_LOCALE_COOKIE_NAME,
    INSIGHT_LOCALE_COOKIE_NAME
  )
  const {
    materialID: materialId,
    salesOrg,
    contractID,
    ipsUser,
    soldto,
    wg = 0,
    webLoginProfileId,
  } = parentWebProduct

  const insightPrice = product?.price?.insightPrice
  const listPrice = product?.price?.listPrice
  const webPrice = product?.price?.webPrice
  const categoryCode = product?.category?.code
  const manufacturerRule = product?.manufacturer?.name
  const materialQualifier = product?.materialQualifier
  const productTypeRule = product?.productTypeRule
  const isLoggedIn = window?.Insight?.isLoggedin
  return {
    ces: true, // always provide CES experience here, even for logged-out users
    contractId: contractID || '',
    categoryCode,
    materialQualifier,
    matId: materialId,
    manufacturerRule,
    productTypeRule,
    salesOrg,
    locale,
    ipsUser,
    soldto,
    uid: webLoginProfileId,
    price: webPrice,
    wg,
    filterCallForPrice: false, // true will filter warranties with call for price
  }
}

function callThirdPartyWarrantiesCES(parentWebProduct) {
  return getProductDetails(parentWebProduct)
    .then(({ product }) => {
      const request = getRequestForThirdPartyWarrantyCES(
        product,
        parentWebProduct
      )
      return post('/insightweb/getWarranty', request).catch(() => [])
    })
    .catch(() => [])
}

export function callThirdPartyWarranties(parentWebProduct) {
  const { isCES } = parentWebProduct
  return isCES
    ? callThirdPartyWarrantiesCES(parentWebProduct)
    : callThirdPartyWarrantiesLegacy(parentWebProduct)
}

/**
 * [attachRRProductWarrenties]
 * at this moment this method only handles first item in request, if in case materialID
 * has multiple parts comma separated then it wont call RR and just returns error
 * which will be cought at cart actions and uses actual request
 * @param  {Array} items [addToCart service request]
 * @return {Array}       [addToCart service request updated with warranties]
 */
export function attachRRProductWarrenties(items, richRelavanceAPI) {
  let { materialID } = Array.isArray(items) && items.length > 0 && items[0]
  let warrantyMaterialIds = []

  let promise = new Promise((resolve, reject) => {
    materialID =
      materialID && materialID.split(',').length === 1 ? materialID : undefined
    if (typeof materialID !== 'undefined') {
      const cartWarrPlacementId = richRelavanceAPI.includes('integration')
        ? rr_warranties_qa
        : rr_warranties
      const body = Object.assign(
        {},
        {
          productId: encodeURIComponent(materialID),
          placementids: cartWarrPlacementId,
          skipSearchResponse: true,
          categoryId: '',
        }
      )
      callRichRelevanceRecommondations(body)
        .then((placements) => {
          const warrantyPlacementResponse = placements.find(function (
            placement
          ) {
            return placement.placementId === cartWarrPlacementId
          })
          warrantyMaterialIds = warrantyMaterialIds.concat(
            warrantyPlacementResponse.prodList.map((item) => item.materialId)
          )
          const body = [{ ...items[0], warrantyMaterialIds }]
          resolve(body)
        })
        .catch(() => {
          reject(Error('Rich relevance failed to respond'))
        })
    } else {
      reject(Error('Invalid materialID, unable to fetch warranties'))
    }
  })
  return promise
}
