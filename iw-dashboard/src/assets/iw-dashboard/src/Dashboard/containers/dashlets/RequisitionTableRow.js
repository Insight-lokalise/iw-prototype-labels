import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { updateRequisitionStatus } from '../../actions'
import RequisitionTableRow from '../../components/dashlets/RequisitionTableRow/RequisitionTableRow'

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      updateRequisitionStatus,
    },
    dispatch
  )
}

export default connect(null, mapDispatchToProps)(RequisitionTableRow)
