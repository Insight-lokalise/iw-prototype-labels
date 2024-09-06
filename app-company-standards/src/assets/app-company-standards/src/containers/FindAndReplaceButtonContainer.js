import { connect } from 'react-redux'

import { selector_wId } from '../duck'
import FindAndReplaceButton from '../components/Catalog/FindAndReplaceButton'

function mapStateToProps(state) {
  return {
    webGroupId: selector_wId(state),
  }
}

export default connect(mapStateToProps)(FindAndReplaceButton)
