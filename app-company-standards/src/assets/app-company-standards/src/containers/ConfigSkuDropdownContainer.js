import { connect } from 'react-redux'

import { selector_configSkuDropdownOptions } from '../duck'
import ConfigSkuDropdown from '../components/CreateStandards/ConfigSkuDropdown'

function mapStateToProps(state) {
  return {
    options: selector_configSkuDropdownOptions(state),
  }
}

export default connect(mapStateToProps)(ConfigSkuDropdown)
