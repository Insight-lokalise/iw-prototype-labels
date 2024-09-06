import { connect } from 'react-redux'

import OrderSummary from './../../components/OrderSummary/OrderSummaryView'
import { selector_orderSummary, selector_soldToCurrency, selector_isXD } from './../../selectors/orderDetailsSelectors'
import { selector_isCanada, selector_isEMEA } from '../../../../Shared/selectors'

function mapStateToProps(state) {
  return {
    costProps: selector_orderSummary(state),
    currency: selector_soldToCurrency(state),
    isCanada: selector_isCanada(state),
    isEMEA: selector_isEMEA(state),
    isXD: selector_isXD(state)
  }
}

export default connect(mapStateToProps)(OrderSummary)
