import React from 'react'
import ProductOverviewTab from './ProductOverviewTab'
import ProductSpecificationsTab from './ProductSpecificationsTab'
import ProductAccessoriesTab from './ProductAccessoriesTab'
import ProductWarrantiesTab from './ProductWarrantiesTab'
import ProductFindSimilarTab from './ProductFindSimilarTab'
import ProductRecentlyViewedTab from './ProductRecentlyViewedTab'
import ProductCNETRating from './ProductCNETRating'
import ProductCrossSellingPanel from './ProductCrossSellingPanel'
import ProductMediaAdvancedFeaturesPanel from './ProductMediaAdvancedFeaturesPanel'
import ProductPromotionsTab from './ProductPromotionsTab'
import ProductLicenseInfoTab from './ProductLicenseInfoTab'
import ProductFootnotesPanel from './ProductFootnotesPanel'
import ProductReviewsTab from './ProductReviewsTab'

export default function ProductSpecsTabPanel() {
  return (
    <div className="c-product-specs-tab-panel">
      <div className="u-hide">
        <h2>Product Specs Tab Panel...</h2>
        <ProductOverviewTab />
        <ProductSpecificationsTab />
        <ProductAccessoriesTab />
        <ProductWarrantiesTab />
        <ProductFindSimilarTab />
        <ProductRecentlyViewedTab />
        <ProductCNETRating />
        <ProductCrossSellingPanel />
        <ProductMediaAdvancedFeaturesPanel />
        <ProductPromotionsTab />
        <ProductLicenseInfoTab />
        <ProductFootnotesPanel />
        <ProductReviewsTab />
      </div>
    </div>
  )
}
