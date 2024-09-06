import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { addToPersonalProductsList, selector_materialList } from '../duck'
import QuickAdd from '../components/Header/QuickAdd'

function mapStateToProps(state) {  
  return {
    invalidProducts: state.productList.invalidProducts,
    numberOFPartsAdded: state.productList.numberOFPartsAdded,
    materialList: selector_materialList(state),
    hasDEP: state.productList.hasDEP,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      addToPersonalProductsList,
    },
    dispatch
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuickAdd)
