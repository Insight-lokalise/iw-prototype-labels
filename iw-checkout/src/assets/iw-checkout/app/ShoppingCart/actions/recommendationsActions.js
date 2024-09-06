import * as constants from './../../libs/constants'
import {
    callRichRelevanceRecommondations,
} from './../../../libs/models/Products'
import { selectRichRelavanceAPI } from './../../../libs/Insight/selectors'
import { selectCartItemMaterialIds } from './../../../libs/Cart/selectors'
import { fetchRecentlyViewedItems } from '../../../libs/models/Products';

export function getRecentlyViewedItems() {
    return {
        type: constants.FETCH_RECENTLY_VIEWED_ITEMS,
        payload: fetchRecentlyViewedItems(),
    }
}


export function getRRRecommendedByCartItems() {
    return (dispatch, getState) => {
        const richRelavanceAPI = selectRichRelavanceAPI(getState())
        const placementName = richRelavanceAPI.includes('integration') ? 'cart_page.rr1_qa' : 'cart_page.rr1'
        const encodedCartItemsString = selectCartItemMaterialIds(getState()).map(item => encodeURIComponent(item))
        const body = {
            productId: encodedCartItemsString.join('|'),
            placementids: placementName,
            categoryId: '',
        }
        return fetchRecommendations(dispatch, body)
    }
}

export function getRRRecommendedItemsForReceiptPage({ productIds = [], productPrices = [], itemQuantities = [], orderId }) {
    return (dispatch, getState) => {
        const richRelavanceAPI = selectRichRelavanceAPI(getState())
        const placementName = richRelavanceAPI.includes('integration') ? 'purchase_complete_page.rr1_qa' : 'purchase_complete_page.rr1'
        const body = {
            placementids: placementName,
            categoryId: '',
            productId: productIds.map(item => encodeURIComponent(item)).join('|'),
            productPrices: productPrices.join('|'),
            itemQuantities: itemQuantities.join('|'),
            orderId: `${orderId}`,
        }
        return fetchRecommendations(dispatch, body)
    }
}

function fetchRecommendations(dispatch, request) {
    const { placementids : placementId } = request
    return callRichRelevanceRecommondations(request).then((placements)=>{
        const payloadData = placements.find(placement => placement.placementId === placementId);
        const payload = payloadData || {
            placementId,
            payload: []
        }
        return dispatch({
            type: constants.FETCH_RECOMMENDED_ITEMS_ON_CART,
            payload,
        })
    })
}

