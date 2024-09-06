import React, { Fragment, useEffect, useReducer } from 'react'
import PropTypes from 'prop-types'

import ButtonRow from './ButtonRow'
import ProductList from './ProductList'
import DragAndDropManager from "../Catalog/DragAndDropManager"
import cloneDeep from "lodash/cloneDeep";

export default function EditProductsForm(props) {
  const { 
    categoryId, isEdit, isShared, isNonConfig, isManagerView,
    locale, onSubmit, productGroupId, 
    products, productSetId, productSetType,
  } = props
  const [productsState, productsDispatch] = useReducer(productsReducer, {
    deleteMap: {},
    order: [],
    productDictionary: {},
  })

  useEffect(() => {
    productsDispatch({ type: 'RESET', payload: handleProducts(products) })
  }, [products])

  function handleSubmit() {
    const items = productsState.order
      .filter(itemId => !productsState.deleteMap[itemId])
      .map(itemId => productsState.productDictionary[itemId])

    onSubmit(items)
  }

  return (
    <Fragment>
      <ButtonRow
        categoryId={categoryId}
        disableLink={true}
        productGroupId={productGroupId}
        productSetId={productSetId}
        isEdit={isEdit}
        isManagerView={isManagerView}
        onSubmit={handleSubmit}
        shared={isShared}
      />
      <DragAndDropManager reorderProducts={orderArray => {productsDispatch({ type: 'UPDATE_ORDER', payload: orderArray })}}
                          productSetId={productSetId}>
        {(dndState, { ...dndFunctions }) => (
          <ProductList
            isNonConfig={isNonConfig}
            droppableId={productSetId}
            locale={locale}
            productsState={productsState}
            productSetType={productSetType}
            isShared={isShared}
            reorderProducts={orderArray => {
              productsDispatch({ type: 'UPDATE_ORDER', payload: {orderArray, productSetId} })
            }}
            toggleRemoveProduct={productId => {
              productsDispatch({ type: 'UPDATE_DELETE_MAP', payload: productId })
            }}
            updateProduct={product => {
              productsDispatch({ type: 'UPDATE_PRODUCT', payload: {product, productSetType} })
            }}
            dndState={dndState}
            dndFunctions={dndFunctions}
          />
        )}
      </DragAndDropManager>
      <ButtonRow
        categoryId={categoryId}
        disableLink={true}
        productGroupId={productGroupId}
        productSetId={productSetId}
        isEdit={isEdit}
        isManagerView={isManagerView}
        onSubmit={handleSubmit}
        shared={isShared}
      />
    </Fragment>
  )
}

EditProductsForm.propTypes = {
  categoryId: PropTypes.string.isRequired,
  isEdit: PropTypes.bool,
  isNonConfig: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  productGroupId: PropTypes.string.isRequired,
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
    })
  ).isRequired,
  productSetId: PropTypes.string.isRequired,
  productSetType: PropTypes.string.isRequired,
}

EditProductsForm.defaultProps = {
  isEdit: false,
  isNonConfig: false,
}

function productsReducer(state, action) {
  switch (action.type) {
    case 'RESET':
      return action.payload
    case 'UPDATE_DELETE_MAP': {
      return {
        ...state,
        deleteMap: { ...state.deleteMap, [action.payload]: !state.deleteMap[action.payload] },
      }
    }
    case 'UPDATE_ORDER':
      return {
        ...state,
        order: action.payload,
      }
    case 'UPDATE_PRODUCT':{
      const {product, productSetType} = action.payload
      const productDictionary = cloneDeep(state.productDictionary)
      const isSingle = (productSetType === "SINGLE" || productSetType === "SINGLEWITHNONE")
      const { preSelect, customDescription } = product
      if(Object.keys(customDescription).length > 0) {
        product.hasCustomDescription = true
      }
      if(isSingle && preSelect) {
        Object.keys(productDictionary).map((pid)=>{
          const p = productDictionary[pid]
          if(p.id !== product.id) {
             p.preSelect = false
          }
        })
      }
      return {
        ...state,
        productDictionary: { ...productDictionary, [product.id]: product },
      }
    }
    default:
      return state
  }
}

function handleProducts(productsArray) {
  return productsArray.reduce(
    (prev, curr) => {
      const currClone = cloneDeep(curr)
      const {customDescription} = currClone
      if(Object.keys(customDescription).length > 0) {
        currClone.hasCustomDescription = true
      }
      prev.order.push(currClone.id)
      prev.productDictionary[currClone.id] = {...currClone}
      prev.deleteMap[currClone.id] = false
      return prev
    },
    { deleteMap: {}, order: [], productDictionary: {} }
  )
}
