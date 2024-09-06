import { connect } from 'react-redux'

import { TAB_LICENSING, UPCOMINGRENEWALS } from '../../components/constants'
import getUpcomingRenewalsData from '../../actions/renewalsActions'
import { selector_prevAPICalls } from '../../selectors/reportingSelectors'
import { UpcomingRenewals } from '../../components/dashlets'

function mapStateToProps(state) {
  return {
    hasData: selector_prevAPICalls(state, UPCOMINGRENEWALS).hasData,
    data: selector_prevAPICalls(state, UPCOMINGRENEWALS).data,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getData: () => dispatch(getUpcomingRenewalsData()),
  }
}

const UpcomingRenewalsDashlet = {
  DashletComponent: connect(mapStateToProps, mapDispatchToProps)(UpcomingRenewals),
  gridProps: { w: 1 },
}

export default UpcomingRenewalsDashlet
