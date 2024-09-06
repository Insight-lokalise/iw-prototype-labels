import { connect } from 'react-redux'

import { selector_wId } from '../duck'
import ImageModalButton from '../components/Shared/ImageModalButton'

function mapStateToProps(state) {
  return {
    webGroupId: selector_wId(state),
  }
}

export default connect(mapStateToProps)(ImageModalButton)
