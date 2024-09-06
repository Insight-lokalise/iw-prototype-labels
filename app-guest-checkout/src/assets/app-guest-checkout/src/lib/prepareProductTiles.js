import React from 'react';
import { triggerTrackingUrl } from "@insight/toolkit-utils";
import RecommendedProduct from "@insight/toolkit-react/lib/RecommendedProduct/RecommendedProduct";
import { getProductInfo } from "../lib/productInformation";

export const prepareProductTiles = ({
  products=[],
  isRecommendedProduct=false,
  addToCart,
  openMiniPDP,
  isLoggedIn,
  isEMEA,
  cartItemsList=[]
}) => {
  return products.map((item, key) => {

    const onAddToCart = () => {
      if (isRecommendedProduct) {
        triggerTrackingUrl(item?.clickTrackingURL);
      }
      addToCart.call(null, [{
        materialID: item.materialId,
        quantity: 1
      }])
    }

    const handleOnClick = () => {
      if(isRecommendedProduct) {
        triggerTrackingUrl(item?.clickTrackingURL)
      }
      openMiniPDP(item.materialId)
    }

    const product = getProductInfo(isRecommendedProduct, item, isLoggedIn);

    if (product?.isCallForPrice) return;

    return (<div key={item.materialId}>
      <RecommendedProduct
        color={'secondary'}
        isLoggedIn={isLoggedIn}
        fullWidth={false}
        onClick={handleOnClick}
        product={product}
        materialId={item.materialId}
        showVAT={isEMEA}
        isInCart={cartItemsList.includes(item.materialId)}
        onAddToBasket={onAddToCart}
        key={key}
        showAddToCartButton={true}
        showPartNumbers={false}
        showPrices={true}
        itemIndex={key}
      />

    </div>)
  }).filter((tile) => tile != null);
}
