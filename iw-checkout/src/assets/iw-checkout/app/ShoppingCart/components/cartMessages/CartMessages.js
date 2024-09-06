import { connect } from 'react-redux'
import some from 'lodash-es/some'

import {
  selector_cart,
  selector_haltUserProgressFromCart,
  selector_hasCoiOrCsi,
  selector_isCloudCart,
  selectDirectBillableItems,
  selector_transportsToDetermine,
  selector_hasQuickCheckout500Error,
  selector_shoppingCartMessageBoxMessages,
  selector_selectInvalidCESParts,
  selector_hasOutOfStockItems,
  selector_hasQtyExceedsStockCartItems,
} from './../../../../libs/Cart/selectors'
import {
  selector_isB2BUser,
  selector_isLoggedIn,
  selector_hasBuyPermission,
  selector_userRequiresApproval,
  selector_numberOfRequestorGroups,
  selector_hasStockAndPriceDisplayDisabled
} from './../../../../libs/User/selectors'
import { CartMessageView } from './CartMessagesView'

function mapStateToProps(state) {
  return {
    splaMessages: selector_cart(state).splaMessages || [],
    hasItemsInCart: selector_cart(state).totalCount > 0,
    isB2BUser: selector_isB2BUser(state),
    haltUserProgressFromCart: selector_haltUserProgressFromCart(state),

    /* state to determine existance of messages on the cart */
    isLoggedIn: selector_isLoggedIn(state),
    hasBuyPermission: selector_hasBuyPermission(state),
    userRequiresApproval: selector_userRequiresApproval(state),
    numberOfRequestorGroups: selector_numberOfRequestorGroups(state),
    isStockAndPriceDisplayDisabled: selector_hasStockAndPriceDisplayDisabled(state),
    hasUsagePeriodReportableNonReportable:
      selector_cart(state).hasUsagePeriodReportableNonReportable || false,
    isCloudCart: selector_isCloudCart(state) || false,
    hasVSPPContract: some(
      selector_cart(state).contracts,
      (contract) => !!contract.vspp
    ),
    contractUsagePeriodReportable: some(
      selector_cart(state).contracts,
      (contract) => !!contract.usagePeriodReportable
    ),
    hasCoiOrCsi: selector_hasCoiOrCsi(state),
    hasDirectBillableItems: selectDirectBillableItems(state).length > 0,
    hasInvalidMaterials:
      (selector_cart(state).invalidMaterialIDs &&
        selector_cart(state).invalidMaterialIDs.length > 0) ||
      false,
    arrayOfInvalidMaterialObjects: selector_cart(state).invalidMaterialIDs,
    hasInternationalFreightFees:
      selector_cart(state).showInternationalShippingOptions,
    transportsToDetermine: selector_transportsToDetermine(state),
    hasQuickCheckout500Error: selector_hasQuickCheckout500Error(state),
    hasShoppingCartMessages: selector_shoppingCartMessageBoxMessages(state),
    hasOutOfStockItems: selector_hasOutOfStockItems(state),
    hasQtyExceedsStockCartItems: selector_hasQtyExceedsStockCartItems(state),
    invalidCESParts: selector_selectInvalidCESParts(state) || [],
  }
}

export default connect(mapStateToProps, null)(CartMessageView)
