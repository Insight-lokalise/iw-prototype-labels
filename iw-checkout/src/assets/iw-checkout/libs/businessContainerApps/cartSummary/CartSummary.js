import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import CartSummaryView from './components/CartSummaryView'
import { action_saveRequestorGroupId } from './actions/cartSummaryActions'
import {
    selectTransformedCartByUserType,
    selector_hasSavedRequestorGroup,
    selector_savedRequestorGroup,
} from './../../Cart/selectors'
import {
  selector_b2bLoginInfo,
  selector_hasStockAndPriceDisplayDisabled,
  selector_hasSuppressShippingEstimateInCart,
  selector_isEMEA,
  selector_numberOfRequestorGroups,
  selector_userRequestorGroups,
  selector_isLoggedIn
} from './../../User/selectors'
import {
    selector_shoppingRequestShippingCost,
    selector_shoppingRequestShipping,
    selector_shoppingRequestCarrier,
    selector_shoppingRequestTaxCost,
    selector_shoppingRequestGstHstTaxCost,
    selector_shoppingRequestPstTaxCost,
    selector_shoppingRequestEWRFee,
} from './../../ShoppingRequest/selectors'
import { selector_activeIndex } from './../../iw-components/iw-accordion/selectors'
import { selector_userSalesOrg } from '../../User/selectors'
import { selector_locale } from '../../Insight/selectors'

function mapStateToProps(state, { useShoppingRequestShipping }) {
    const cart = selectTransformedCartByUserType(state)
    const isCanada = selector_userSalesOrg(state) === '4100'
    const isPastShippingOptions = selector_activeIndex(state, 'SBP') > 1
    const locale = selector_locale(state)
    const useShoppingRequest = isPastShippingOptions || useShoppingRequestShipping
    const taxCost = useShoppingRequest ? selector_shoppingRequestTaxCost(state) : cart.taxCost
    const gstHstTaxCost = selector_shoppingRequestGstHstTaxCost(state)
    const pstTaxCost = selector_shoppingRequestPstTaxCost(state)
    const ewrFeeAmount = useShoppingRequest ? selector_shoppingRequestEWRFee(state) : cart.ewrFee

    const shippingCost = useShoppingRequest
        ? selector_shoppingRequestShippingCost(state)
        : cart.shippingCost

    return {
        cart,
        locale,
        taxCost,
        pstTaxCost,
        gstHstTaxCost,
        shippingCost,
        useShoppingRequest,
        isPastShippingOptions,
        ewrFeeAmount,
        isCanada,
        b2bLoginInfo: selector_b2bLoginInfo(state),
        hasSavedRequestorGroup: selector_hasSavedRequestorGroup(state),
        numberOfRequestorGroups: selector_numberOfRequestorGroups(state),
        savedRequestorGroup: selector_savedRequestorGroup(state),
        savedShippingOption: selector_shoppingRequestShipping(state),
        savedCarrier: selector_shoppingRequestCarrier(state),
        suppressShippingEstimateInCart: selector_hasSuppressShippingEstimateInCart(state),
        isStockAndPriceDisplayDisabled: selector_hasStockAndPriceDisplayDisabled(state),
        userRequestorGroups: selector_userRequestorGroups(state),
        isEMEA: selector_isEMEA(state),
        isLoggedIn:selector_isLoggedIn(state)
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        action_saveRequestorGroupId,
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(CartSummaryView)
