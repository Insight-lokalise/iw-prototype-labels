import React from 'react'
import cn from 'classnames'
import { t } from '@insight/toolkit-utils'

import { ProductDetailCompareItemRow } from './ProductDetailCompareItemRow'

const ATTRIBUTES_TO_DISPLAY = 10

export const ProductDetailCompareSkeleton = (props) => {
  const renderAttributes = () => {
    if (!props.attributes?.length) return null
    const selectedAttributes = props.attributes.slice(0, ATTRIBUTES_TO_DISPLAY)
    return selectedAttributes.map((attr) => (
      <ProductDetailCompareItemRow rowId={attr.label} key={attr.label}>
        <span>{attr.label}</span>
      </ProductDetailCompareItemRow>
    ))
  }
  return (
    <article
      className={cn(
        'c-product-compare__item o-grid__item u-1/1 u-1/2@tablet u-1/5@desktop',
        props.className
      )}
    >
      <div className="c-product-compare__item__body">
        <div className="c-product-compare__item__body__labels">
          <ProductDetailCompareItemRow rowId={'availability'}>
            <span>{t('Availability')}</span>
          </ProductDetailCompareItemRow>
          {renderAttributes()}
          <ProductDetailCompareItemRow
            rowId="__empty__"
            className="c-product-compare__item__body__empty-row"
          ></ProductDetailCompareItemRow>
        </div>
      </div>
    </article>
  )
}

export default ProductDetailCompareSkeleton
