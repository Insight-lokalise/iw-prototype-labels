import * as constants from './../../../Cart/constants';
import {
  callRichRelevanceRecommondations,
  convertToProductWarranty,
  fetchAccessories,
  fetchWarrantyData,
} from './../../../models/Products';
import {selectRichRelavanceAPI} from '../../../Insight/selectors';
import {selector_cartItem} from "../../../Cart/selectors";
import {callThirdPartyWarranties} from "../../../models/Products/recommendations";
import {selector_userInformation,selector_locale} from "../../../User/selectors";

export function getAccessories({ materialID, materialIDKey, contractID = '', softwareContractId = '' }) {
    return dispatch => {
        dispatch({
            type: constants.GET_ACCESSORIES,
            payload: fetchAccessories({ materialID, contractID, softwareContractId })
                .then(product => {
                    return Object.assign({}, {
                        product,
                        materialIDKey,
                        contractID,
                    })
                }),
        })
    }
}

export function getCESAccessories({ materialID, materialIDKey, contractID = '' }) {
  return (dispatch, getState) => {
    const richRelavanceAPI = selectRichRelavanceAPI(getState());
    const cartItem = selector_cartItem(getState(), materialIDKey, contractID)
    const isIntegration = richRelavanceAPI.includes('integration')
    const accessoryPlacementID = 'cart_page.rr_accessories'
    const RRRequest = Object.assign({}, {
      productId: encodeURIComponent(materialID),
      placementids: accessoryPlacementID
    })
    dispatch({
      type: constants.GET_CES_ACCESSORIES,
      payload: callRichRelevanceRecommondations(RRRequest)
        .then(placements => {
          const accessoryPlacementResponse = placements.find(placement => placement.placementId === accessoryPlacementID);
          const products = accessoryPlacementResponse ? accessoryPlacementResponse.prodList.map((item, key) => {
            return item
          }): []
          return Object.assign({}, {
            product: {
              accessories: products,
              hasAccessories: products.length > 0,
              webProduct: {
                image: cartItem.imageURLs,
                description: cartItem.description,
                materialId: cartItem.materialID,
                manufacturerPartNumber: cartItem.mfrPartNumber
              }
            },
            materialIDKey,
            contractID,
          })
        }),
    })
  }
}

export function getWarranties({ materialID, materialIDKey, contractID = '' }) {
    return (dispatch, getState) => {
        const richRelavanceAPI = selectRichRelavanceAPI(getState());
        dispatch({
            type: constants.GET_WARRANTIES,
            payload: fetchWarrantyData({ materialID, contractID, richRelavanceAPI })
                .then(warrantyData => {
                    return Object.assign({}, {
                        warrantyData,
                        materialIDKey,
                        contractID,
                    })
                }),
        })
    }
}

export function getThirdPartyWarranties({materialIDKey, contractID = '', ...rest}) {
  return (dispatch,getState) => {
    const state = getState();
    const {
      webLoginProfileId,
      soldto,
      isIpsUser,
      webGroupId,
      salesOrg:userSalesOrg,
      currencyCode,
      isCES
     } = selector_userInformation(state);
    const { isIpsLogo } = window.Insight;
    const locale = selector_locale(state)
    const salesOrg = userSalesOrg || getDefaultLoggedOutSalesOrg(locale, isIpsLogo);
    const requestData = {
      contractID,
      ipsUser:isIpsUser,
      soldto,
      webLoginProfileId,
      wg:webGroupId,
      isCES,
      salesOrg,
      currencyCode,
      ...rest
    }
    dispatch({
      type: constants.GET_THIRD_PARTY_WARRANTIES,
      payload: callThirdPartyWarranties(requestData)
        .then(response => {
          let thirdPartyWarranties = [];
          if (Array.isArray(response)) {
            thirdPartyWarranties = response.map(convertToProductWarranty)
          }
          return Object.assign({}, {
            materialIDKey,
            contractID,
            thirdPartyWarranties,
          })
        }),
    })
  }
}
