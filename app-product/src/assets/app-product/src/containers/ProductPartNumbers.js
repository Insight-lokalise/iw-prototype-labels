import { connect } from 'react-redux'
import ProductPartNumbers from '../components/ProductPartNumbers'

/**
 * Display the insight and manufacturer numbers, along with the UNSPSC number
 * (from the list of classification values) if present.
 */
const mapStateToProps = ({ product }) => {
  const classification = product.classification || []
  const unspsc = classification.find(element => element.scheme === 'UNSPSC')

  return {
    insightNumber: product.insightNumber,
    manufacturerNumber: product.manufacturerNumber,
    unspscNumber: unspsc && unspsc.value,
  }
}

export default connect(mapStateToProps)(ProductPartNumbers)
