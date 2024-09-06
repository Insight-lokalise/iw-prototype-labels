import React from 'react'
import { RecommendedProduct } from '@insight/toolkit-react';
import { triggerTrackingUrl } from '@insight/toolkit-utils';

const ProductTile = (props) => {
  const handleButtonClick = () => {
    // Google tracking event
    if (typeof dataLayer !== 'undefined') {
      dataLayer.push({
        event: props.parentComponent,
        materialId: props.materialId || '',
      })
    }
    triggerTrackingUrl(props.product?.clickTrackingURL);
    props.onClick();
  }

  const navigateToProductDetailsPage = () => {
    triggerTrackingUrl(props.product?.clickTrackingURL, () => {
      window.open(props.product.href, '_self')
    });
  }

  return (
    <RecommendedProduct
      color={props.color}
      fullWidth={props.fullWidth}
      showVAT={props.showVAT}
      isInCart={props.isInCart}
      key={props.key}
      onClick={() => navigateToProductDetailsPage()}
      product={props.product}
      showAddToCartButton={true}
      showPartNumbers={true}
      showPrices={!props.isStockAndPriceDisabled}
      onAddToBasket={() => handleButtonClick()}
    />
  )
}

export default ProductTile
