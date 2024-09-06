import React from 'react'
import OverviewCNETScript from './OverviewCNETScript'
import { OverviewOverride } from './OverviewOverride'

export const ProductDetailTabOverview = () => (
  <div className="c-product-tabs__overview">
    <OverviewOverride />
    <OverviewCNETScript />
  </div>
)

export default ProductDetailTabOverview
