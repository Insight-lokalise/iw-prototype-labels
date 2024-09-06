import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { ENTITY_TYPES } from '../components/Routes'

import {
  getCategory,
  getProductGroup,
  getProductSet,
  selector_category,
  selector_productGroup,
  selector_productSet,
} from '../duck'

function mapStateToProps(state, { entityId, entityType }) {
  const entity = (() => {
    switch (entityType) {
      case ENTITY_TYPES.CATEGORY:
        return selector_category(state, entityId)
      case ENTITY_TYPES.PRODUCT_GROUP:
        return selector_productGroup(state, entityId)
      case ENTITY_TYPES.PRODUCT_SET:
        return selector_productSet(state, entityId)
      default:
        return {}
    }
  })()

  return { entity }
}

function mapDispatchToProps(dispatch, { entityId, entityType, categoryId }) {
  const getEntity = (() => {
    switch (entityType) {
      case ENTITY_TYPES.CATEGORY:
        return () => getCategory({ categoryId: entityId })
      case ENTITY_TYPES.PRODUCT_GROUP:
        return () => getProductGroup({ productGroupId: entityId, categoryId })
      case ENTITY_TYPES.PRODUCT_SET:
        return () => getProductSet({ productSetId: entityId, categoryId })
      default:
        return () => {}
    }
  })()

  return bindActionCreators({ getEntity }, dispatch)
}

function EntityProvider(props) {
  const { getEntity, ...otherProps } = props

  useEffect(() => {
    getEntity()
  }, [props.entityId])

  return props.entity ? props.children({ ...otherProps }) : null
}

EntityProvider.propTypes = {
  entity: PropTypes.shape({}),
  getEntity: PropTypes.func.isRequired,
  entityId: PropTypes.string.isRequired,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EntityProvider)
