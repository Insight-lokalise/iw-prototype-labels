import {connect} from 'react-redux'

import {selector_wId} from '../../duck'
import DuplicateView from '../../components/Settings/Duplicate/Duplicate'

function mapStateToProps(state) {
  return {
    parentId: selector_wId(state)
  }
}


export default connect(mapStateToProps)(DuplicateView)
