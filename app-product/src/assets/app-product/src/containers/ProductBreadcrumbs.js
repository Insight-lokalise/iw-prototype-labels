import { connect } from 'react-redux'
import ProductBreadcrumbs from '../components/ProductBreadcrumbs'

const mapStateToProps = state => ({
  category: state.product.category,
  product: state.product,
})

export default connect(mapStateToProps)(ProductBreadcrumbs)
