import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { editProductSetItems, getProductSetItems, selector_locale, selector_productSetItems } from '../duck'
import { ENTITY_TYPES } from '../components/Routes'
import AddEditProducts from '../components/CreateStandards/AddEditProducts'
import EntityProvider from './EntityProvider'

function mapStateToProps(state, { productSetId }) {
  return {
    locale: selector_locale(state),
    products: selector_productSetItems(state, productSetId)
  }
}

function mapDispatchToProps(dispatch, { productSetId, categoryId }) {
  return bindActionCreators(
    {
      fetchProductSetItems: () => getProductSetItems(productSetId, categoryId),
      onSubmit: (items, messenger) => editProductSetItems({ items, productSetId, messenger }),
    },
    dispatch
  )
}

function AddEditProductsContainer(props) {
  const { fetchProductSetItems, ...otherProps } = props

  useEffect(() => {
    props.fetchProductSetItems()
  }, [props.productSetId])

  return (
    <EntityProvider 
      entityId={props.productSetId} 
      entityType={ENTITY_TYPES.PRODUCT_SET}
      categoryId={props.categoryId}
    >
      {({ entity }) => <AddEditProducts productSet={entity} {...otherProps} />}
    </EntityProvider>
  )
}

AddEditProductsContainer.propTypes = {
  fetchProductSetItems: PropTypes.func.isRequired,
  productSetId: PropTypes.string.isRequired,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddEditProductsContainer)
