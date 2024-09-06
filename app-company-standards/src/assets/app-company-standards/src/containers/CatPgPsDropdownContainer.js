import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { LanguageContext } from '../lib'
import { fetchCategories } from '../api'
import CatPgPsDropdown from '../components/MulitpleViews/CatPgPsDropdown'
import {
  getCategories,
  getProductGroupsByCategory,
  getProductSetsByProductGroup,
  selector_categories,
  selector_productGroups,
  selector_productSets,
} from '../duck'

export const DROPDOWN_TYPES = {
  CATEGORY: 'Category',
  PRODUCT_GROUP: 'Product group',
  PRODUCT_SET: 'Product set',
}

export const NONE_SELECTED = 'none-selected'

function mapStateToProps(state, { type }) {
  const rawData = (() => {
    switch (type) {
      case DROPDOWN_TYPES.CATEGORY:
        return selector_categories(state)
      case DROPDOWN_TYPES.PRODUCT_GROUP:
        return selector_productGroups(state)
      case DROPDOWN_TYPES.PRODUCT_SET:
        return selector_productSets(state)
      default:
        return []
    }
  })()

  return { rawData }
}

function mapDispatchToProps(dispatch, { isManagerView, parentId, type }) {
  const getOptions = (() => {
    switch (type) {
      case DROPDOWN_TYPES.CATEGORY:
        return () => isManagerView ? getCategories() : getCategories(parentId)
      case DROPDOWN_TYPES.PRODUCT_GROUP:
        return () => getProductGroupsByCategory(parentId)
      case DROPDOWN_TYPES.PRODUCT_SET:
        return () => getProductSetsByProductGroup(parentId)
      default:
        return () => { }
    }
  })()

  return bindActionCreators(
    {
      getOptions,
    },
    dispatch
  )
}

function CatPgPsDropdownContainer(props) {
  const { getOptions, optionsFilter, parentId, useCurrentWebGroup, rawData, ...otherProps } = props
  const { language } = useContext(LanguageContext)
  const [differentWebGroupOptions, setDifferentWebGroupOptions] = useState([])

  function createOptions(dictionary, defaultText) {
    const defaultSelection = [
      {
        text: defaultText,
        onChangeValue: {id: NONE_SELECTED},
        value: NONE_SELECTED,
      }
    ]
    if (Object.keys(dictionary).length === 0) return defaultSelection
    const options = Object.values(dictionary)
      .filter(obj => props.parentId === obj.parents[obj.parents.length - 1])
      .filter(optionsFilter)
      .map(obj => ({
        text: obj.name[language],
        onChangeValue: obj,
        value: obj.id,
      }))

    return (!defaultText ?
      [...options]
      :
      [
        ...defaultSelection,
        ...options,
      ])
  }

  const currentWebGroupOptions = (() => {
    switch (props.type) {
      case DROPDOWN_TYPES.CATEGORY:
        return createOptions(rawData, 'Select a category')
      case DROPDOWN_TYPES.PRODUCT_GROUP:
        return createOptions(rawData, 'Select a product group')
      case DROPDOWN_TYPES.PRODUCT_SET:
        return createOptions(rawData, 'Select a product set')
      default:
        return []
    }
  })()

  const getDiffCategory = async () => {
    const result = await fetchCategories({ wId: parentId });
    setDifferentWebGroupOptions(createOptions(result?.data, 'Select a category'))
  }

  useEffect(() => {
    useCurrentWebGroup ? getOptions() : getDiffCategory();
  }, [parentId])

  return <CatPgPsDropdown
    {...otherProps}
    options={differentWebGroupOptions.length > 0 ? differentWebGroupOptions : currentWebGroupOptions}
  />
}

CatPgPsDropdownContainer.propTypes = {
  getOptions: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  optionsFilter: PropTypes.func,
  parentId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  rawData: PropTypes.shape({}).isRequired,
  useCurrentWebGroup: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
}

CatPgPsDropdownContainer.defaultProps = {
  optionsFilter: () => true,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CatPgPsDropdownContainer)
