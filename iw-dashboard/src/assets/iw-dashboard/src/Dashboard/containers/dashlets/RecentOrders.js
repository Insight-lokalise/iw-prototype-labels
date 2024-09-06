import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { TAB_ORDERS } from '../../components/constants'
import { getRecentOrders } from '../../actions'
import { selector_recentOrdersData } from '../../selectors'
import { RecentOrders } from '../../components/dashlets'

function mapStateToProps(state) {
  return {
    recentOrdersData: selector_recentOrdersData(state),
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getRecentOrders,
    },
    dispatch
  )
}

const RecentOrdersDashlet = {
  gridProps: { w: 2 },
  DashletComponent: connect(mapStateToProps, mapDispatchToProps)(RecentOrders),
}

export default RecentOrdersDashlet
