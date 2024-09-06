import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import CESCheckoutButtonView from './CESCheckoutButtonView'
import { fetchPopulateUIFlags } from './../../../../libs/OrderMetaData/actions'
import {
  getShoppingRequest,
  proceedToCheckout,
} from '../../../../libs/ShoppingRequest/actions'
import { setActiveIndex } from '../../../../libs/iw-components/iw-accordion/actions'
import {
  setQuickCheckout,
  submitEnrollmentValues,
} from '../../../../libs/businessContainerApps/cart/actions'

import {
  selector_cartItemsEnrollment,
} from '../../../../libs/Cart/selectors'

export const CESCheckoutButton = (props) => {
  return <CESCheckoutButtonView {...props} />
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchPopulateUIFlags,
      getShoppingRequest,
      proceedToCheckout,
      setActiveIndex,
      setQuickCheckout,
      submitEnrollmentValues,
    },
    dispatch
  )
}

function mapStateToProps(state) {
  return {
    enrollmentInfo: selector_cartItemsEnrollment(state),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CESCheckoutButton)
