import React, { useContext, useEffect } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getInObject } from '@insight/toolkit-utils'

import {
  getCategory,
  getProductGroup,
  getProductSet,
  selector_category,
  selector_productGroup,
  selector_productSet,
} from '../duck'
import { LanguageContext } from '../lib'
import NameDisplay from '../components/MulitpleViews/NameDisplay'

function mapStateToProps(state, { categoryId, productGroupId, productSetId }) {
  const category = selector_category(state, categoryId)
  const productGroup = selector_productGroup(state, productGroupId)
  const productSet = selector_productSet(state, productSetId)

  return { category, productGroup, productSet }
}

function mapDispatchToProps(dispatch, { categoryId, productGroupId, productSetId }) {
  const getEntities = [dispatch(getCategory({ categoryId }))]

  if (productGroupId) {
    getEntities.push(dispatch(getProductGroup({ productGroupId, categoryId })))
  }
  if (productSetId) {
    getEntities.push(dispatch(getProductSet({ productSetId, categoryId })))
  }

  return bindActionCreators({ getEntities }, dispatch)
}

function NameDisplayContainer(props) {
  const { category, categoryId, getEntities, productGroup, productGroupId, productSet, productSetId } = props
  const { language } = useContext(LanguageContext)

  useEffect(() => {
    getEntities.forEach(getReq => {
      getReq()
    })
  }, [categoryId, productGroupId, productSetId])

  return (
    <NameDisplay
      categoryId={category.id}
      categoryName={getName(category, language)}
      productGroupId={productGroup.id}
      productGroupName={getName(productGroup, language)}
      productSetId={productSet.id}
      productSetName={getName(productSet, language)}
    />
  )
}

NameDisplayContainer.propTypes = {
  categoryId: PropTypes.string.isRequired,
  category: PropTypes.shape({
    name: PropTypes.objectOf(PropTypes.string).isRequired,
  }),
  getEntities: PropTypes.arrayOf(PropTypes.func),
  productGroupId: PropTypes.string,
  productGroup: PropTypes.shape({
    name: PropTypes.objectOf(PropTypes.string).isRequired,
  }),
  productSet: PropTypes.shape({
    name: PropTypes.objectOf(PropTypes.string).isRequired,
  }),
  productSetId: PropTypes.string,
}

NameDisplayContainer.defaultProps = {
  category: { name: {} },
  getEntities: [],
  productGroup: { name: {} },
  productGroupId: '',
  productSet: { name: {} },
  productSetId: '',
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NameDisplayContainer)

function getName(stateObj, language) {
  return getInObject(stateObj, ['name', [language]], '')
}
