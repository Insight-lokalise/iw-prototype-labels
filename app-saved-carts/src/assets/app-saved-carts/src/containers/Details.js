import { connect } from 'react-redux'

import { selector_cart } from '../duck'
import DetailsView from '../components/DetailsView'

function mapStateToProps(state, ownProps) {
  const { data, hasFailed, isLoading } = selector_cart(state, ownProps.id)
  return {
    cart: data,
    hasFailed,
    isLoading,
  }
}

export default connect(mapStateToProps)(DetailsView)
