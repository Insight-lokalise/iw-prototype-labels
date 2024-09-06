import { connect } from 'react-redux'

import { TAB_NEWS } from '../../components/constants'
import { selector_locale } from '../../selectors/userSelectors'
import { InsightNews } from '../../components/dashlets'

function mapStateToProps(state) {
  return {
    locale: selector_locale(state),
  }
}

const InsightNewsDashlet = {
  gridProps: { w: 1 },
  DashletComponent: connect(mapStateToProps, null)(InsightNews),
}

export default InsightNewsDashlet
