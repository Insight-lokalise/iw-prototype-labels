import React from 'react'
import cn from 'classnames'
import { t } from '@insight/toolkit-utils'
import { ProductDetailCompareItemRow } from './ProductDetailCompareItemRow'

export const ProductDetailCompareSkeleton = ({ attributes, className }) => {
  const renderAttributes = () => {
    if (!attributes?.length) return null
    return attributes.map((attr) => (
      <ProductDetailCompareItemRow rowId={attr.label} key={attr.label}>
        <span>{attr.label}</span>
      </ProductDetailCompareItemRow>
    ))
  }
  return (
    <article
      className={cn(
        'c-compare-similar__product__item o-grid__item u-1/5',
        className
      )}
    >
      <div className="c-compare-similar__product__item__body">
        <div className="c-compare-similar__product__item__body__labels">
          <ProductDetailCompareItemRow rowId={'availability'}>
            <span>{t('Availability')}</span>
          </ProductDetailCompareItemRow>
          {renderAttributes()}
          <ProductDetailCompareItemRow
            rowId="__empty__"
            className="c-compare-similar__product__item__body__empty-row"
          ></ProductDetailCompareItemRow>
        </div>
      </div>
    </article>
  )
}

export default ProductDetailCompareSkeleton
