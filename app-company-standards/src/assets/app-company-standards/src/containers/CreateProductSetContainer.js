import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { createProductSet } from '../duck'
import { ENTITY_TYPES } from '../components/Routes'
import CreateProductSet from '../components/CreateStandards/CreateProductSet'
import EntityProvider from './EntityProvider'

function mapDispatchToProps(dispatch, { parentId }) {
  return bindActionCreators(
    {
      onSubmit: (formData, messenger) => createProductSet({ productSet: formData, parentProductGroupId: parentId, messenger }),
    },
    dispatch
  )
}

function CreateProductSetContainer(props) {
  return (
    <EntityProvider entityId={props.parentId} entityType={ENTITY_TYPES.PRODUCT_GROUP}>
      {({ entity }) => <CreateProductSet productGroup={entity} {...props} />}
    </EntityProvider>
  )
}

CreateProductSetContainer.propTypes = {
  parentId: PropTypes.string.isRequired,
}

export default connect(
  null,
  mapDispatchToProps
)(CreateProductSetContainer)
