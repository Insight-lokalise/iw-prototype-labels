import { connect } from 'react-redux'

import DashboardWrapper from '../components/DashboardWrapper'
import { addDashlet, removeDashlet, changeLayout, changeSelectedTab } from '../actions/settingsActions'
import { selector_availableDashlets, selector_dashboardSettings } from '../selectors/settingsSelectors'
import { selector_userData } from '../selectors/userSelectors'

function mapStateToProps(state) {
  return {
    availableDashlets: selector_availableDashlets(state),
    dashboardSettings: selector_dashboardSettings(state),
    userData: selector_userData(state),
  }
}
function mapDispatchToProps(dispatch) {
  return {
    addDashlet: (dashlet, tab) => dispatch(addDashlet(dashlet, tab)),
    changeLayout: (layouts, tab) => dispatch(changeLayout(layouts, tab)),
    changeSelectedTab: selectedTab => dispatch(changeSelectedTab(selectedTab)),
    removeDashlet: (dashlet, tab) => dispatch(removeDashlet(dashlet, tab)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardWrapper)
