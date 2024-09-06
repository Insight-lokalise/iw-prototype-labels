import { connect } from 'react-redux'
import ProductDescription from '../components/ProductDescription'

// The `mapStateToProps` function maps from the Redux state to props that are
// then passed to the connected component.
const mapStateToProps = state => ({
  title: state.product.title,
  subtitle: state.product.subtitle,
})


// Connect the ProductDescription component to the Redux state, returning a
// new, generated component.
export default connect(mapStateToProps)(ProductDescription)
