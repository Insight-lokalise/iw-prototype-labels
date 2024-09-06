import { connect } from 'react-redux'

import { IWDate } from '../../iw-components'
import { selector_monthNames } from '../selectors/userSelectors'

function mapStateToProps(state) {
  return {
    monthList: selector_monthNames(state),
  }
}

export default connect(mapStateToProps, null)(IWDate)
