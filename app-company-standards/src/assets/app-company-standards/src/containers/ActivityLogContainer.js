import { connect } from 'react-redux'

import ActivityLog from '../components/Activity/ActivityLog'
import { selector_wId } from '../duck'

function mapStateToProps(state) {
  return {
    wId: selector_wId(state)
  }
}

export default connect(mapStateToProps)(ActivityLog)
