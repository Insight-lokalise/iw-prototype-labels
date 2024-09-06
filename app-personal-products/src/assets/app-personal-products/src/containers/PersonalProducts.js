import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import {
  getPersonalProductList,
  removeFromPersonalProductsList,
  updatePersonalProductsOrder,
  selector_hasBestPrice,
  selector_hasCOI,
  selector_hasCSI,
  selector_hasReserved,
  selector_isAllValid,
  selector_isInventorySearchEnabled,
  selector_isPurchasingPopUpEnabled,
  Selector_isYourPriceLabel,
  selector_personalProductList,
  selector_sequenceList,
  selector_user,
} from '../duck'

import PersonalProductsView from '../components/PersonalProductsView'

const mapStateToProps = state => ({
  isAllValid: selector_isAllValid(state),
  isBestPriceAvailable: selector_hasBestPrice(state),
  isCOIAvailable: selector_hasCOI(state),
  isCSIAvailable: selector_hasCSI(state),
  isReservedAvailable: selector_hasReserved(state),
  productsList: selector_personalProductList(state),
  productSequence: selector_sequenceList(state),
  isInventorySearchEnabled: selector_isInventorySearchEnabled(state),
  isPurchasingPopUpEnabled: selector_isPurchasingPopUpEnabled(state),
  isYourPriceLabel: Selector_isYourPriceLabel(state),
  user: selector_user(state),
})

const mapDispatchToProps = dispatch => bindActionCreators({
  getPersonalProductList,
  removeFromPersonalProductsList,
  updatePersonalProductsOrder,
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PersonalProductsView)
