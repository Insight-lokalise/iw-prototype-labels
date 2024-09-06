import {
    selector_isLoggedIn,
    selector_hasBuyPermission,
    selector_userRequiresApproval,
    selector_numberOfRequestorGroups } from './../../../libs/User/selectors'
import { selector_isSharedUser } from './cartResponse'
import { selector_shoppingCartHasErrorMessages } from './messages'
import { selector_disableNextPageDueToUsageReporting, selector_hasConflictEnrollmentStatus } from './usageReportingSelector'

export const selector_shoppingCartView = state => state.shoppingCartView

export const getShipEstimate = state => selector_shoppingCartView(state).shippingEstimator
export const getQuickShop = state => selector_shoppingCartView(state).quickShop
export const selector_quickCheckoutObject = state => selector_shoppingCartView(state).isQuickCheckout
export const selector_isQuickCheckout = state => selector_quickCheckoutObject(state).quickCheckout
export const selector_hasQuickCheckout500Error = state => selector_quickCheckoutObject(state).has500Error

export const selectRecentlyViewedItems = state => selector_shoppingCartView(state).recentlyViewedItems
export const selectRecommendedItems = state => selector_shoppingCartView(state).recommendedItems

export const selector_isPrintPreviewOpen = state => !!selector_shoppingCartView(state).printPreview.isOpen

export const selectIsShoppingCartReadOnly = state => selector_shoppingCartView(state).isReadOnly || false

export const getDigitalDataCheckoutType = state => selector_shoppingCartView(state).digitalDataCheckoutType.digitalDataCheckoutType

export function selector_haltUserProgressFromCart(state) {
    return (
                (
                    (
                    (selector_isLoggedIn(state) && (!selector_hasBuyPermission(state) && !selector_isSharedUser(state)))
                    && (selector_userRequiresApproval(state) || selector_numberOfRequestorGroups(state) === 0)
                    )
                    || selector_shoppingCartHasErrorMessages(state)
                    || selector_disableNextPageDueToUsageReporting(state)
                )
                || selector_hasConflictEnrollmentStatus(state)
           )
}
