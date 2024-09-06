import { connect } from 'react-redux'
import ContractView from './ContractView'

import {
  selector_isEMEA,
} from '../../../../duck'

const mapStateToProps = state => ({
  isEMEA: selector_isEMEA(state),
})

export default connect(
  mapStateToProps
)(ContractView)
