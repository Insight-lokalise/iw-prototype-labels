import { connect } from 'react-redux'

import App from '../components/App'
import { selector_loadingState, selector_locked } from '../duck'

function mapStateToProps(state) {
  return {
    loadingState: selector_loadingState(state),
    locked: selector_locked(state),
  }
}

export default connect(mapStateToProps)(App)
