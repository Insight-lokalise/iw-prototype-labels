import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import CartSummarySimple from './CartSummarySimpleView'
import {
  selector_cart,
  selector_hasOutOfStockItems,
  selector_hasQtyExceedsStockCartItems,
  selectTransformedCartByUserType,
  selector_cartItemsEnrollment,
} from '../../Cart/selectors'
import {
  selector_shoppingRequestShippingCost,
  selector_shoppingRequestShipping,
  selector_shoppingRequestCarrier,
  selector_shoppingRequestTaxCost,
  selector_shoppingRequestEWRFee,
  selector_shoppingRequestGstHstTaxCost,
  selector_shoppingRequestPstTaxCost,
} from '../../ShoppingRequest/selectors'
import {
  selector_isCES,
  selector_isLimitedUser,
  selector_userSalesOrg,
  selector_hasStockAndPriceDisplayDisabled,
  selector_isLoggedIn
} from '../../User/selectors'
import { selector_activeIndex } from '../../iw-components/iw-accordion/selectors'
import { selector_locale } from '../../Insight/selectors'
import { transformCartAction } from '../cartSummary/actions/cartSummaryActions'
import { submitEnrollmentValues, emptyCart } from '../cart/actions'

function mapStateToProps(state, { useShoppingRequestShipping }) {
  const cart = selectTransformedCartByUserType(state)
  const isPastShippingOptions = selector_activeIndex(state, 'SBP') > 1
  const locale = selector_locale(state)
  const isCanada = selector_userSalesOrg(state) === '4100'
  const useShoppingRequest = isPastShippingOptions || useShoppingRequestShipping
  const taxCost = useShoppingRequest
    ? selector_shoppingRequestTaxCost(state)
    : cart.taxCost
  const ewrFeeAmount = useShoppingRequest
    ? selector_shoppingRequestEWRFee(state)
    : cart.ewrFee
  const cartIsEmpty = selector_cart(state).totalCount === 0

  const shippingCost = useShoppingRequest
    ? selector_shoppingRequestShippingCost(state)
    : cart.shippingCost

  const gstHstTaxCost = useShoppingRequest
    ? selector_shoppingRequestGstHstTaxCost(state)
    : cart.gstHstTax

  const pstTaxCost = useShoppingRequest
    ? selector_shoppingRequestPstTaxCost(state)
    : cart.pstTaxCost
  const isLoggedIn = selector_isLoggedIn(state)

  return {
    cart,
    cartIsEmpty,
    enrollmentInfo: selector_cartItemsEnrollment(state),
    ewrFeeAmount,
    isPastShippingOptions,
    locale,
    hasOutOfStockItems: selector_hasOutOfStockItems(state),
    hasQtyExceedsStockCartItems: selector_hasQtyExceedsStockCartItems(state),
    savedShippingOption: selector_shoppingRequestShipping(state),
    savedCarrier: selector_shoppingRequestCarrier(state),
    isStockAndPriceDisplayDisabled: selector_hasStockAndPriceDisplayDisabled(state),
    shippingCost,
    taxCost,
    gstHstTaxCost,
    pstTaxCost,
    isCanada,
    useShoppingRequest,
    isLoggedIn,
    isSimplifiedCESUser: selector_isLimitedUser(state) && selector_isCES(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      transformCartAction,
      submitEnrollmentValues,
      emptyCartAction: emptyCart,
    },
    dispatch
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(CartSummarySimple)
