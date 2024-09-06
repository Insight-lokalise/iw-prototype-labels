import React, { useContext, useEffect, useState } from 'react'
import {
  connectToLocale,
  Carousel,
} from '@insight/toolkit-react'
import { t, triggerTrackingUrl, getVatPriceProps } from '@insight/toolkit-utils'
import { addToShoppingRequest } from 'app-api-user-service'
import addToCartRequest from '@insight/toolkit-utils/lib/helpers/addToCartRequest'
import { getShoppingRequestEnabledFlag } from "@insight/toolkit-utils/lib/helpers/getShoppingRequestEnabledFlag";
import { PDPContext } from '../../context'
import { PlacementsContext } from '../../context'
import { getSessionUser } from "../../api/getSessionUser";
import RecommendedProducts from './RecommendedProducts';

function ProductPeopleBoughtTogether({ context }) {
  const { locale, permissions, contract, isIPSUser, currencyCode } = context;
  const { enableViewPricing } = permissions;
  const { addToCart, isLoggedIn, setContractId, setMiniPDP, showVAT } = useContext(PDPContext);
  const { bought_together, accessories, protection, thirdPartyProtection, recommendationsPrices, recommendationsSSEComplete } = useContext(PlacementsContext);
  let recommendationsData = {}
  if (accessories && protection && thirdPartyProtection) {
    recommendationsData = { accessories, protection, thirdPartyProtection }
  }
  const [addToCartState, setAddToCartState] = useState({
    loading: false,
    fulfilled: false,
    rejected: null,
    selectedMaterialId: null,
  });

  const isStockAndPriceDisabled = isLoggedIn ? Insight?.webGroupPermissions?.includes('disable_stock_and_price_display') : false;
  const isIPSUserWithContract = isIPSUser && !!contract


  useEffect(() => {
    if (!addToCartState.fulfilled) return
    // Set timer to remove added to cart message
    const timer = setTimeout(
      () => setAddToCartState({ loading: false, fulfilled: false }),
      10000
    )
    return () => clearTimeout(timer)
  }, [addToCartState.fulfilled])

  const openMiniPDP = (materialId, trackingUrl, contractId) => {
    triggerTrackingUrl(trackingUrl);
    setMiniPDP(materialId)
    setContractId(contractId)
  }

  const addToCartHandler = async (product, selectedContract) => {
    triggerTrackingUrl(product.clickTrackingURL);
    try {
      const { userInformation } = await getSessionUser()
      const webGroupId = userInformation?.webGroup?.webGroupId
      const isShoppingReqWGEnabled = window?.flags['GNA-11686-CES-SHOPPING-CART'].indexOf(webGroupId) !== -1
      const isLoggedOutDefault = window?.flags['GNA-10394-SHOPPING-CART'] && !isLoggedIn && locale.split("_")[1] === 'US'
      const isShoppingCartEnabled = getShoppingRequestEnabledFlag(locale, isLoggedOutDefault, isShoppingReqWGEnabled)
      setAddToCartState({
        ...addToCartState,
        loading: true,
        selectedMaterialId: product.materialId,
      })

      if (isShoppingCartEnabled && !isIPSUserWithContract) {
        //this is done because in case of ips we need to use the addtocart api rather than shopping request for logged out 
        const payload = [
          {
            hasAccessories: false,
            locale,
            materialId: product.materialId,
            quantity: 1,
            warrantyMaterialIds: false,
          },
        ]
        // Add current product to shopping req
        await addToCartRequest(payload, addToShoppingRequest)
      } else {
        // Add current product to cart
        await addToCart({
          ...product,
          quantity: 1,
          ...(isIPSUserWithContract && { contractId: selectedContract?.contractNumber ? selectedContract?.contractNumber : contract?.contractNumber, contractName: selectedContract?.contractName ? selectedContract?.contractName : contract?.contractName }),
        },
          isLoggedIn,
          undefined,
          undefined,
          isIPSUserWithContract
        )
      }
      setAddToCartState({
        ...addToCartState,
        loading: false,
        fulfilled: true,
        selectedMaterialId: product.materialId,
      })
    } catch (err) {
      setAddToCartState({
        ...addToCartState,
        loading: false,
        rejected: err.message,
      })
    }
  }

  if (!bought_together || !bought_together?.prodList?.length) return null;

  const renderProducts = () => {
    const { exclVatProps, inclVatProps } = getVatPriceProps(showVAT);
    return bought_together?.prodList?.map((product, index) => {
      const selectedProduct =
        addToCartState.selectedMaterialId === product.materialId;
      const productMaterialId = product?.materialId
      const priceInfo = isIPSUserWithContract ? recommendationsPrices? recommendationsPrices[productMaterialId]: null : {}
      const isContractLoading = !recommendationsSSEComplete && !priceInfo && isIPSUserWithContract
      const isContractTimeOut = recommendationsSSEComplete && !priceInfo && isIPSUserWithContract
      const currency = product.price?.currency;
      return (
        <RecommendedProducts
          product={product}
          currencyCode={currencyCode}
          currency={currency}
          addToCartState={addToCartState}
          addToCartHandler={addToCartHandler}
          isLoggedIn={isLoggedIn}
          isIPSUser={isIPSUser}
          hasViewPricingDisabled={!enableViewPricing}
          isStockAndPriceDisabled={isStockAndPriceDisabled}
          selectedProduct={selectedProduct}
          index={index}
          contract={contract}
          exclVatProps={exclVatProps}
          inclVatProps={inclVatProps}
          isContractLoading={isContractLoading}
          isContractTimeOut={isContractTimeOut}
          priceInfo={priceInfo}
          openMiniPDP={openMiniPDP}
          locale={locale}
        />
      )
    })
  }

  return (
    <div className="c-product-people-bought-together">
      <h5 className="c-product-people-bought-together__title">
        {t('People who bought this item also bought')}
      </h5>
      <Carousel
        id="carouselMultiple"
        slides={{
          mobile: 1,
          mobileLandscape: 2,
          tablet: 3,
          tabletLandscape: 4,
          desktop: 5,
        }}
      >
        {renderProducts()}
      </Carousel>
    </div>
  )
}

export default connectToLocale(ProductPeopleBoughtTogether)
