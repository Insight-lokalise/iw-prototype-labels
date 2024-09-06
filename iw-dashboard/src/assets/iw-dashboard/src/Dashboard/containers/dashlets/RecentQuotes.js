import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { TAB_ORDERS } from '../../components/constants'
import { getRecentQuotes } from '../../actions'
import { selector_recentQuotesData } from '../../selectors'
import { RecentQuotes } from '../../components/dashlets'

function mapStateToProps(state) {
  return {
    recentQuotesData: selector_recentQuotesData(state),
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getRecentQuotes,
    },
    dispatch
  )
}

const RecentQuotesDashlet = {
  gridProps: { w: 1 },
  DashletComponent: connect(mapStateToProps, mapDispatchToProps)(RecentQuotes),
}

export default RecentQuotesDashlet
