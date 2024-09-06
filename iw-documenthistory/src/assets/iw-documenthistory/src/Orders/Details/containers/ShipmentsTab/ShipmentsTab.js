import { connect } from 'react-redux'
import ShipmentsTabView from '../../components/ShipmentsTab/ShipmentsTabView'
import { selector_shipments } from '../../selectors/orderDetailsSelectors'
import { selector_isEMEA } from '../../../../Shared/selectors'

function mapStateToProps(state) {
  return {
    shipments: selector_shipments(state),
    isEMEA: selector_isEMEA(state)
  }
}

export default connect(mapStateToProps)(ShipmentsTabView)
