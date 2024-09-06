import React from 'react'

import ProductBreadcrumbs from '../containers/ProductBreadcrumbs'
import ProductDescription from '../containers/ProductDescription'
import ProductPartNumbers from '../containers/ProductPartNumbers'

import ProductSendToColleagueButton from './ProductSendToColleagueButton'
import ProductSendToColleagueDialog from './ProductSendToColleagueDialog'
import ProductPrintButton from './ProductPrintButton'
import ProductImagesGallery from './ProductImagesGallery'
import ProductPrice from './ProductPrice'
import ProductAvailabilityInfo from './ProductAvailabilityInfo'
import ProductDetails from './ProductDetails'
import ProductManufacturerImage from './ProductManufacturerImage'
import ProductQuantity from './ProductQuantity'
import ProductAddToCartButton from './ProductAddToCartButton'
import ProductOrderingHelpInfo from './ProductOrderingHelpInfo'
import ProductAddToPersonalProductListButton from './ProductAddToPersonalProductListButton'
import ProductAddToCompare from './ProductAddToCompare'
import ProductSearchMessage from './ProductSearchMessage'
import ProductApprovedItemInfo from './ProductApprovedItemInfo'
import ProductLeasingOptionLink from './ProductLeasingOptionLink'
import ProductPromotionsInfo from './ProductPromotionsInfo'
import ProductAdditionalDetailsList from './ProductAdditionalDetailsList'
import ProductProtectYourPurchaseLink from './ProductProtectYourPurchaseLink'
import ProductSellRequirementsButton from './ProductSellRequirementsButton'
import ProductSellRequirementsDialog from './ProductSellRequirementsDialog'
import ProductBidInfo from './ProductBidInfo'
import ProductBuyingOptionsButton from './ProductBuyingOptionsButton'
import ProductBuyingOptionsDialog from './ProductBuyingOptionsDialog'
import ProductTotalPriceEstimateButton from './ProductTotalPriceEstimateButton'
import ProductTotalPriceEstimateDialog from './ProductTotalPriceEstimateDialog'
import ProductAddToCompanyStandardsButton from './ProductAddToCompanyStandardsButton'
import ProductAddToCompanyStandardsDialog from './ProductAddToCompanyStandardsDialog'
import ProductCNETRating from './ProductCNETRating'
import ProductCustomerReviews from './ProductCustomerReviews'
import ProductSimilarProducts from './ProductSimilarProducts'

export default function ProductSummaryPanel() {
  return (
    <div className="c-product-summary-panel">
      <ProductBreadcrumbs />
      <ProductDescription />
      <ProductPartNumbers />

      <div className="u-hide">
        <h2>Product Summary Panel...</h2>
        <ProductSendToColleagueButton />
        <ProductSendToColleagueDialog />
        <ProductPrintButton />
        <ProductImagesGallery />
        <ProductPrice />
        <ProductAvailabilityInfo />
        <ProductDetails />
        <ProductManufacturerImage />
        <ProductQuantity />
        <ProductAddToCartButton />
        <ProductOrderingHelpInfo />
        <ProductAddToPersonalProductListButton />
        <ProductAddToCompare />
        <ProductSearchMessage />
        <ProductApprovedItemInfo />
        <ProductLeasingOptionLink />
        <ProductPromotionsInfo />
        <ProductAdditionalDetailsList />
        <ProductProtectYourPurchaseLink />
        <ProductSellRequirementsButton />
        <ProductSellRequirementsDialog />
        <ProductBidInfo />
        <ProductBuyingOptionsButton />
        <ProductBuyingOptionsDialog />
        <ProductTotalPriceEstimateButton />
        <ProductTotalPriceEstimateDialog />
        <ProductAddToCompanyStandardsButton />
        <ProductAddToCompanyStandardsDialog />
        <ProductCNETRating />
        <ProductCustomerReviews />
        <ProductSimilarProducts />
      </div>
    </div>
  )
}
