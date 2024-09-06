import { connect } from 'react-redux'

import BarChart from '../components/dashlets/reporting/BarChart'
import { selector_countries } from '../selectors/settingsSelectors'

function mapStateToProps(state) {
  return {
    countries: selector_countries(state),
  }
}

export default connect(mapStateToProps)(BarChart)
