import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { TAB_ORDERS } from '../../components/constants'
import { getRecentInvoices } from '../../actions'
import { selector_recentInvoicesData } from '../../selectors'
import { RecentInvoices } from '../../components/dashlets'

function mapStateToProps(state) {
  return {
    recentInvoicesData: selector_recentInvoicesData(state),
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getRecentInvoices,
    },
    dispatch
  )
}

const RecentInvoicesDashlet = {
  gridProps: { w: 1 },
  DashletComponent: connect(mapStateToProps, mapDispatchToProps)(RecentInvoices),
}

export default RecentInvoicesDashlet
