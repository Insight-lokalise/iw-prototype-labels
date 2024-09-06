import { connect } from 'react-redux'

import { TAB_NEWS } from '../../components/constants'
import { selector_Welcome } from "../../selectors/dashletSelectors";
import { Welcome } from '../../components/dashlets'
import { getWelcome } from "../../actions/dashletActions";

function mapStateToProps(state) {
  return {
    hasData: selector_Welcome(state).hasData,
    data: selector_Welcome(state).data,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getData: () => dispatch(getWelcome())
  }
}

const WelcomeDashlet = {
  DashletComponent: connect(mapStateToProps, mapDispatchToProps)(Welcome),
  defaultTab: TAB_NEWS,
  gridProps: { w: 1 },
  title: 'Welcome',
}

export default WelcomeDashlet
