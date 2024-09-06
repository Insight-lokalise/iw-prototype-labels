import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { TAB_ORDERS } from '../../components/constants'
import { getRequestorRequisitions } from '../../actions'
import { selector_requestorRequisitions, selector_requestorDashletRequisitionHistoryResults } from '../../selectors'
import { Requestor } from '../../components/dashlets'

function mapStateToProps(state) {
  return {
    requestorRequisitions: selector_requestorRequisitions(state),
    showHeaderLink: selector_requestorDashletRequisitionHistoryResults(state).length === 0,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getRequestorRequisitions,
    },
    dispatch
  )
}

const RequestorDashlet = {
  gridProps: { w: 2 },
  DashletComponent: connect(mapStateToProps, mapDispatchToProps)(Requestor),
}

export default RequestorDashlet
