import { connect } from 'react-redux'

import { selector_userData } from '../duck'

import ProductCompareView from '../components/List/ListItemCard/Details/ProductCompareView'

const mapStateToProps = state => ({
    user: selector_userData(state),
})

export default connect(mapStateToProps)(ProductCompareView)
  
