import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { editProductSet } from '../duck'
import { ENTITY_TYPES } from '../components/Routes'
import EditProductSet from '../components/CreateStandards/EditProductSet'
import EntityProvider from './EntityProvider'

function mapDispatchToProps(dispatch, { productSetId }) {
  return bindActionCreators(
    {
      onSubmit: (formData, messenger) => editProductSet({ productSet: formData, productSetId, messenger, categoryId }),
    },
    dispatch
  )
}

function EditProductSetContainer(props) {
  return (
    <EntityProvider 
      entityId={props.productSetId} 
      entityType={ENTITY_TYPES.PRODUCT_SET}
      categoryId={props.categoryId}
    >
      {({ entity }) => <EditProductSet productSet={entity} {...props} />}
    </EntityProvider>
  )
}

EditProductSetContainer.propTypes = {
  productSetId: PropTypes.string.isRequired,
}

export default connect(
  null,
  mapDispatchToProps
)(EditProductSetContainer)
