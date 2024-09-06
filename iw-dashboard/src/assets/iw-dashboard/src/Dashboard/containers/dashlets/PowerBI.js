import { connect } from 'react-redux'

import { selector_powerBI } from "../../selectors/dashletSelectors";
import {
  selector_currentTab
} from "../../selectors/settingsSelectors";
import { PowerBI } from '../../components/dashlets'
import { getPowerBI } from "../../actions/dashletActions";

function mapStateToProps(state, { dashletId }) {
  const { filters, ...data } = selector_powerBI(state, dashletId)
  return {
    currentTab: selector_currentTab(state),
    data,
    hasData: Object.keys(selector_powerBI(state, dashletId)).length > 0,
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  const { dashletId } = ownProps
  return {
    getData: () => dispatch(getPowerBI(dashletId))
  }
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  const { data, hasData } = stateProps
  const { getData } = dispatchProps
  return {
    ...ownProps,
    data,
    getData,
    hasData,
  }
}

const PowerBIDashlet = {
  DashletComponent: connect(mapStateToProps, mapDispatchToProps, mergeProps)(PowerBI),
  gridProps: { w: 1 },
}

export default PowerBIDashlet
