import { connect } from 'react-redux'

import PublishAll from '../components/Catalog/PublishAll'
import { selector_wId, publishAll } from '../duck'

function mapStateToProps(state) {
  return {
    wId: selector_wId(state),    
  }
}

function mapDispatchToProps(dispatch) {
  return {
    publishAllHandler: (wId, messenger) => dispatch(publishAll(wId, messenger)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PublishAll)
