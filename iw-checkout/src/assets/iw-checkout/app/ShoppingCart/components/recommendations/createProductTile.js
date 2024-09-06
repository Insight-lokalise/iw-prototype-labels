import React from 'react'
import ProductTile from './productTile'
import {
  getAppropriateProductPrice,
  productImageToRender,
} from './../../../../libs/models/Products/'
import { triggerTrackingUrl } from '@insight/toolkit-utils';

export function createProductTile(
  cartItemMaterialIds,
  addToCart,
  isLoggedIn,
  hideAddToCart = false,
  openProductDetailsInNewTab = true,
  isCES = false,
  showVAT = false,
  product,
  isStockAndPriceDisabled
) {
  const { webProduct, clickTrackingURL: trackingUrl } = product
  const isWebProduct = !!webProduct
  const itemPricing = isWebProduct
    ? getAppropriateProductPrice(
        webProduct.prices,
        webProduct.contractDisplayInfo
      )
    : product.price
  if (itemPricing.priceLabel === 'CALLFORPRICELABEL') return null
  const itemToAdd = {
    isCES,
    materialID: product.materialId,
    quantity: 1,
    contractID: isWebProduct
      ? (webProduct.contractDisplayInfo &&
          webProduct.contractDisplayInfo.contractId) ||
        ''
      : product.contractId,
  }
  const onAddToCart = () => {
    if (trackingUrl) triggerTrackingUrl(trackingUrl)
    addToCart.call(null, [itemToAdd])
  }

  const itemImage = isWebProduct
    ? productImageToRender(webProduct.image)
    : product.image

  return (
    <div key={product.materialId}>
      <ProductTile
        className="Carousel__ProductTile"
        isLoggedIn={isLoggedIn}
        trackingUrl={trackingUrl}
        parentComponent="Recommended Items"
        description={product.description}
        price={itemPricing}
        isInCart={cartItemMaterialIds.includes(product.materialId)}
        imageSRC={itemImage}
        onClick={onAddToCart}
        webProduct={webProduct}
        materialId={product.materialId}
        onAddToCartFromMorePrices={addToCart.bind(null)}
        hideAddToCart={hideAddToCart}
        openProductDetailsInNewTab={openProductDetailsInNewTab}
        showVAT={showVAT}
        isStockAndPriceDisabled={isStockAndPriceDisabled}
        isRecommendedProduct
      />
    </div>
  )
}
