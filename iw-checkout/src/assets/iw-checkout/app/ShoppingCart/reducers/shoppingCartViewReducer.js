import { combineReducers } from 'redux'

import { shippingEstimator } from './shippingEstimatorReducer'
import recentlyViewedItems from './recentlyViewedItemsReducer'
import recommendedItems from './recommendedItemsReducer'
import { quickShop } from './quickShopReducer'
import usageReporting from './usageReportingReducer'
import printPreview from './printPreviewReducer'
import digitalDataCheckoutType from './digitalDataCheckoutReducer'
import isQuickCheckout from './isQuickCheckout'
import summary from '../../../libs/businessContainerApps/cartSummary/reducers/CartSummaryReducer'

export const shoppingCartView = combineReducers({
    digitalDataCheckoutType,
    recentlyViewedItems,
    recommendedItems,
    shippingEstimator,
    quickShop,
    usageReporting,
    printPreview,
    summary,
    hasSavedRequestorGroupAutomatically(state = false, action) { if (action.type === 'SET_HAS_SAVED_REQUESTOR_GROUP_AUTOMATICALLY') return action.payload; else return state },
    isReadOnly(state = false, action) { if (action.type === 'SET_SHOPPING_CART_READ_ONLY') return action.payload; else return state },
    isQuickCheckout,
})
