import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import {
  retrieveCart,
  deleteCart,
  selector_list,
  selector_permissions,
} from '../duck'
import SavedCartsView from '../components/SavedCartsView'

function mapStateToProps(state) {
  const { isLoading, hasFailed, data} = selector_list(state)
  const { enablePurchasePopup } = selector_permissions(state)
  return {
    enablePurchasePopup,
    hasFailed,
    isLoading,
    list: data,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    deleteCart,
    retrieveCart,
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SavedCartsView)
