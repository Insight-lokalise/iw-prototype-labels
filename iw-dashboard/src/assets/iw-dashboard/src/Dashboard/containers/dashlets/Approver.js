import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { TAB_ORDERS } from '../../components/constants'
import { getApproverRequisitions } from '../../actions'
import { selector_approverRequisitions, selector_approverDashletRequisitionHistoryResults } from '../../selectors'
import { Approver } from '../../components/dashlets'

function mapStateToProps(state) {
  return {
    approverRequisitions: selector_approverRequisitions(state),
    showHeaderLink: selector_approverDashletRequisitionHistoryResults(state).length === 0,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getApproverRequisitions,
    },
    dispatch
  )
}

const ApproverDashlet = {
  gridProps: { w: 2 },
  DashletComponent: connect(mapStateToProps, mapDispatchToProps)(Approver),
}

export default ApproverDashlet
