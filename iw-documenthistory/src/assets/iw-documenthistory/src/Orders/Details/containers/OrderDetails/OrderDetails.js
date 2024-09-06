import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from "react-router";

import DetailsView from '../../DetailsView'
import { getOrderDetails } from '../../actions/orderDetailActions'
import {
  selector_isXD,
  selector_hasShippableItems,
  selector_isShipComplete,
  selector_reportUsage
} from '../../selectors/orderDetailsSelectors'

import { selector_isLoggedIn } from '../../../../Shared/selectors'

function mapStateToProps(state) {
  return {
    hasShippableItems: selector_hasShippableItems(state),
    isLoggedIn: selector_isLoggedIn(state),
    isShipComplete: selector_isShipComplete(state),
    reportUsage: selector_reportUsage(state),
    isXD: selector_isXD(state),
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getOrderDetails,
    },
    dispatch
  )
}
export default compose (withRouter, connect(mapStateToProps, mapDispatchToProps))(DetailsView)
