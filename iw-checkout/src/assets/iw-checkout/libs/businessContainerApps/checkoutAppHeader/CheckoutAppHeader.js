import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import {
  selector_cart,
  selector_isCloudCart,
} from '../../Cart/selectors'
import { selector_freightTax, selector_isB2BUser, selector_isEMEA, selector_isLoggedIn } from '../../User/selectors'
import { setActiveIndex } from '../../iw-components/iw-accordion/actions'

// should not be importing from app move uiflags to top level state
import { selector_hasLineLevelPage, selector_isRequisition } from '../../../app/LineLevel/selectors'
import ROUTES from '../../routes'
import CheckoutAppHeaderView from './CheckoutAppHeaderView'
import {
    CART_TITLE,
    CHECKOUT_TITLE,
    CART_TRANSFER_TITLE,
} from './constants'


function mapStateToProps(state, ownProps) {
    // we have access to route here:
    // ownProps.location.pathname === ROUTES.VIEW_CART || similar
    const { pathname } = ownProps.location
    const activeStepperIndex = stepperIndexMap[pathname] || 0
    const title = titleMap[pathname]
    const isCloudCart = selector_isCloudCart(state)
    const cartIsEmpty = selector_cart(state).totalCount === 0
    const hideStepper = [ROUTES.VIEW_CART, ROUTES.RECEIPT].includes(pathname)
    const showReturnToCartLink = !isCloudCart && !hideStepper
    const showOrderUtilities = !isCloudCart && !cartIsEmpty && ![ROUTES.LINE_LEVEL, ROUTES.SHIP_BILL_PAY].includes(pathname)
    const hideExportAsFile = pathname === ROUTES.RECEIPT || !selector_isLoggedIn(state)
    const showDuplicateOrderLink = pathname === ROUTES.RECEIPT
    const showOrderReviewDetails = pathname === ROUTES.PLACE_ORDER
    const showOrderReceiptDetails = pathname === ROUTES.RECEIPT
    const freightTax = selector_freightTax(state)
    const isB2BUser = selector_isB2BUser(state)
    const hideSendToColleague = (selector_isEMEA(state) && pathname === ROUTES.PLACE_ORDER || pathname === ROUTES.RECEIPT) || !selector_isLoggedIn(state)
    const hidePrintFeature = !selector_isLoggedIn(state)

    return {
      activeStepperIndex,
      cartIsEmpty,
      freightTax,
      hideExportAsFile,
      hideStepper,
      isB2BUser,
      isRequisition: selector_isRequisition(state),
      hideSendToColleague,
      pathname,
      showDuplicateOrderLink,
      showLineLevelStep: selector_hasLineLevelPage(state),
      showOrderUtilities,
      showReturnToCartLink,
      showOrderReviewDetails,
      showOrderReceiptDetails,
      title,
      hidePrintFeature
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        setActiveIndex,
    }, dispatch)
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CheckoutAppHeaderView))


const titleMap = {
    [ROUTES.VIEW_CART]: CART_TITLE,
    [ROUTES.LINE_LEVEL]: CHECKOUT_TITLE,
    [ROUTES.SHIP_BILL_PAY]: CHECKOUT_TITLE,
    [ROUTES.PLACE_ORDER]: CHECKOUT_TITLE,
    [ROUTES.RECEIPT]: CHECKOUT_TITLE,
    [ROUTES.CART_TRANSFER]: CART_TRANSFER_TITLE,
}


const stepperIndexMap = {
    [ROUTES.LINE_LEVEL]: 0,
    [ROUTES.SHIP_BILL_PAY]: 1,
    [ROUTES.PLACE_ORDER]: 2,
    [ROUTES.CART_TRANSFER]: 2,
}
