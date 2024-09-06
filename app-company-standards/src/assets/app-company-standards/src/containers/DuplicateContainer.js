import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { ENTITY_TYPES } from '../components/Routes'
import EntityProvider from './EntityProvider'

import Duplicate from '../components/Duplicate/Duplicate'
import { duplicateCategory, duplicateProductGroup, duplicateProductSet, selector_isManagerView } from '../duck'

function mapStateToProps(state) {
  return {
    isManagerView: selector_isManagerView(state)
  }
}

function mapDispatchToProps(dispatch, { messenger, viewType, categoryId }) {
  const actionCreators = (() => {
    switch (viewType) {
      case ENTITY_TYPES.CATEGORY:
        return { duplicate: (formData, sameWebgroup) => duplicateCategory(formData, messenger, sameWebgroup) }
      case ENTITY_TYPES.PRODUCT_GROUP:
        return { duplicate: (formData, sameWebgroup) => duplicateProductGroup(formData, messenger, sameWebgroup, categoryId) }
      case ENTITY_TYPES.PRODUCT_SET:
        return { duplicate: (formData, isManagerView) => duplicateProductSet(formData, messenger, isManagerView) }
      default:
        return () => { }
    }
  })()

  return bindActionCreators(actionCreators, dispatch)
}

function DuplicateContainer(props) {
  return (
    <EntityProvider entityId={props.id} entityType={props.viewType}>
      {({ entity }) => <Duplicate entity={entity} {...props} />}
    </EntityProvider>
  )
}

DuplicateContainer.propTypes = {
  id: PropTypes.string.isRequired,
  viewType: PropTypes.string.isRequired,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DuplicateContainer)
