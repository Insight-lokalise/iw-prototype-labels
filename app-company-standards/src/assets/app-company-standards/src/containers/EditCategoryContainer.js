import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { editCategory } from '../duck'
import { ENTITY_TYPES } from '../components/Routes'
import EditCategory from '../components/CreateStandards/EditCategory'
import EntityProvider from './EntityProvider'

function mapDispatchToProps(dispatch, { categoryId }) {
  return bindActionCreators(
    {
      onSubmit: (formData, messenger) => editCategory({ category: formData, categoryId, messenger }),
    },
    dispatch
  )
}

function EditCategoryContainer(props) {
  return (
    <EntityProvider entityId={props.categoryId} entityType={ENTITY_TYPES.CATEGORY}>
      {({ entity }) => <EditCategory {...props} category={entity} />}
    </EntityProvider>
  )
}

EditCategoryContainer.propTypes = {
  categoryId: PropTypes.string.isRequired,
}

export default connect(
  null,
  mapDispatchToProps
)(EditCategoryContainer)
