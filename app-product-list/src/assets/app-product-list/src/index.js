import React from 'react'
import { render } from 'react-dom'
import { ProductList } from './components/ProductList'
import './scss/index.scss'

export function createProductListInstance(elementId, componentPath) {
  const element = document.getElementById(elementId)
  return render(
    <div className="c-product-list">
      <ProductList componentPath={componentPath} />
    </div>,
    element
  )
}
