import React from 'react'
import { ProductBreadcrumb } from './ProductBreadcrumb/ProductBreadcrumb'
import { ProductHeader } from './ProductHeader'
import {
  PDPProvider,
  CompareSimilarProvider,
} from '../context'
import { UIProvider } from '../shared/UIContext/UIContext'
import ProductMiniPDP from './ProductMiniPDP'
import PlacementsDetailPage from './PlacementsDetailPage'

export const ProductDetailsPage = () => (
  <div className="c-pdp-page row" itemScope itemType="https://schema.org/Product" >
    <UIProvider>
      <PDPProvider>
        <CompareSimilarProvider>
          <ProductBreadcrumb />
          <ProductHeader />
          <PlacementsDetailPage />
          <ProductMiniPDP />
        </CompareSimilarProvider>
      </PDPProvider>
    </UIProvider>
  </div>
)

export default ProductDetailsPage
