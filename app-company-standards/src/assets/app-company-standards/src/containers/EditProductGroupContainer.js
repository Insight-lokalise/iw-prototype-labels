import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { editProductGroup } from '../duck'
import { ENTITY_TYPES } from '../components/Routes'
import EditProductGroup from '../components/CreateStandards/EditProductGroup'
import EntityProvider from './EntityProvider'

function mapDispatchToProps(dispatch, { productGroupId }) {
  return bindActionCreators(
    {
      onSubmit: (formData, updatedProductGroupId, messenger) => editProductGroup({
         productGroup: formData, 
         currentId: !!updatedProductGroupId? updatedProductGroupId: productGroupId,
         messenger 
        }),
    },
    dispatch
  )
}

function EditProductGroupContainer(props) {
  return (
    <EntityProvider 
      entityId={props.productGroupId} 
      entityType={ENTITY_TYPES.PRODUCT_GROUP}
      categoryId={props.categoryId}
    >
      {({ entity }) => <EditProductGroup productGroup={entity} {...props} />}
    </EntityProvider>
  )
}

EditProductGroupContainer.propTypes = {
  productGroupId: PropTypes.string.isRequired,
}

export default connect(
  null,
  mapDispatchToProps
)(EditProductGroupContainer)
