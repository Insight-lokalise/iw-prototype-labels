import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import AddToSetButton from '../components/CreateStandards/AddToSetButton'
import { validateItemsAndAddToProductSet } from '../duck'

function mapDispatchToProps(dispatch, { materialIds, productSetId, quantity }) {
  return bindActionCreators(
    {
      validateItemsAndAddToProductSet: () => validateItemsAndAddToProductSet({ materialIds, productSetId, quantity }),
    },
    dispatch
  )
}

function AddToSetButtonContainer(props) {
  return <AddToSetButton {...props} />
}

AddToSetButtonContainer.propTypes = {
  validateItemsAndAddToProductSet: PropTypes.func.isRequired,
}

export default connect(
  null,
  mapDispatchToProps
)(AddToSetButtonContainer)
