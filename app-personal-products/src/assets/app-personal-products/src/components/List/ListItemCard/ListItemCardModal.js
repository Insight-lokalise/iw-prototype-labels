import { connect } from 'react-redux'
import ListItemCardModalView from './ListItemCardModalView'

import {
  selector_isEMEA,
} from '../../../duck'

const mapStateToProps = state => ({
  isEMEA: selector_isEMEA(state),
})

export default connect(
  mapStateToProps
)(ListItemCardModalView)
