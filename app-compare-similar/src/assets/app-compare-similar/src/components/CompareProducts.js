import React, { useContext, useState } from 'react'
import {
  AddToCartModal,
  connectToLocale,
  AddItemToCartModal,
} from '@insight/toolkit-react'
import { addToShoppingRequest, isHybridXEnabled } from 'app-api-user-service'
import addToCartRequest from '@insight/toolkit-utils/lib/helpers/addToCartRequest'
import { addToShoppingCartGAE } from '@insight/toolkit-utils'
import { getShoppingRequestEnabledFlag } from '@insight/toolkit-utils/lib/helpers/getShoppingRequestEnabledFlag'
import { ProductDetailsRowSizeContextProvider } from '../context/ProductDetailsRowSizeContext'
import ProductDetailCompareItem from './ProductDetailCompareItem'
import { ProductDetailCompareSkeleton } from './ProductDetailCompareSkeleton'
import { CompareSimilarContext } from '../context/compare'
import { RecommendationsContext } from '../context/RecommendationsContext'
function CompareProducts({ context }) {
  const [selectedCompare, setCompare] = useState(null)
  const { similarProducts, addToCart } = useContext(CompareSimilarContext)
  const { RRPriceInfo, richRelevanceSSEComplete, richRelevanceSSEError, selectedContract } = useContext(RecommendationsContext)
  const { isLoggedIn, locale, userInformation, permissions, isIPSUser, contract } = context
  const isIPSUserWithContract = isIPSUser && !!contract
  const webGroupId = userInformation?.webGroup?.webGroupId
  const webGroupPermissions = userInformation?.webGroupPermissions
  const isCES = userInformation?.isCES
  const isShoppingReqWGEnabled =
    window?.flags['GNA-11686-CES-SHOPPING-CART'].indexOf(webGroupId) !== -1
    const isStockAndPriceDisabled = isLoggedIn ? webGroupPermissions?.includes('disable_stock_and_price_display') : false
  const hasCompareProducts = similarProducts?.products?.length >= 1
  const isProductComparedEnabled = (isLoggedIn && isIPSUser) ? window?.Insight?.userPermissions?.includes('product_compare') : true
  const currentItemDisplayFields = hasCompareProducts
    ? similarProducts.products[0].displayFields
    : null

  const availabilityToQuantity = (availability) => {
    if (availability === 'AVAILABLE') return 11
    else if (availability === 'LIMITED') return 9
    return 0
  }
  const currency = similarProducts.currency

  const onModalClose = () => setCompare(null)

  const onModalOpen = ({
    product,
    accessories,
    protection,
    thirdPartyProtection,
    quantity,
    stock,
  }) => {
    setCompare({
      product: {
        ...product,
        materialId: product.sku,
      },
      accessories,
      protection,
      thirdPartyProtection,
      quantity,
      stock,
      openModal: true,
    })
  }

  const addToCartItems = async (res,categoryType) => {
    const isLoggedOutDefault =
      window?.flags['GNA-10394-SHOPPING-CART'] &&
      !isLoggedIn &&
      locale.split('_')[1] === 'US'
    const isShoppingCartEnabled = getShoppingRequestEnabledFlag(
      locale,
      isLoggedOutDefault,
      isShoppingReqWGEnabled
    )
    const isLogoutIPS = window?.flags && window?.flags["GNA-12345-LOGGEDOUT-E4-IPS"]
    if (isShoppingCartEnabled && !isLogoutIPS) {
      const payload = [
        {
          hasAccessories: false,
          locale,
          materialId: res.materialID || res.materialId,
          quantity: res.quantity,
          warrantyMaterialIds: false,
        },
      ]
      const cartData = await addToCartRequest(payload, addToShoppingRequest)
      const cartItem = cartData.shoppingRequest.cart.cartItems.find(
        (part) => part.materialInfo.materialId == res.materialID
      )
      if(cartItem) {
        const addedCartItem = {
          name: cartItem.materialInfo.description,
          id: cartItem.materialInfo.materialId,
          productSku: cartItem.materialInfo.manufacturerPartNumber,
          insightPartId: cartItem.materialInfo.materialId,
          price: cartItem.totalPrice,
          brand: cartItem.materialInfo.manufacturerName,
          category: cartItem.materialInfo.categoryId,
          quantity: 1,
          currency: currency,
          categoryType: categoryType,
        }
        addToShoppingCartGAE(cartData.shoppingRequest.cart, [addedCartItem])
      }
    } else {
      await addToCart({
        ...res,
        materialId: res.materialID || res.materialId,
        ...((isIPSUser && res.contractId) && { contractID: res.contractId }),
        ...((isIPSUser && res.contractType) && { contractType: res.contractType })
      },categoryType)
    }
  }

  const renderCompareItem = () => {
    return similarProducts?.products?.map((similarProduct, index) => {
      const stock = (isHybridXEnabled(isLoggedIn, isCES) || (isIPSUser && !!contract))? similarProduct?.regularStock : availabilityToQuantity(similarProduct?.availability);
      const compareClassName = (!similarProduct?.price?.callForPrice && (isIPSUser && !!contract)) ? 'is-ips' : null;
      return (
        <ProductDetailCompareItem
          key={similarProduct.sku}
          product={similarProduct}
          materialId={similarProduct.sku}
          name={similarProduct.description || similarProduct.longDescription}
          thumbnailUrl={similarProduct.image}
          productUrl={similarProduct.image}
          attributes={similarProduct.displayFields}
          stock={stock}
          unlimited={similarProduct.unlimited}
          onModalOpen={onModalOpen}
          callForPrice={similarProduct.callForPrice}
          metadata={similarProducts}
          currencyCode={currency}
          isShoppingReqWGEnabled={isShoppingReqWGEnabled}
          showBackOrder={true}
          isStockAndPriceDisabled={isStockAndPriceDisabled}
          className={compareClassName}
        />
      )
    })
  }
  const renderProducts = () => {
    if (!hasCompareProducts || !isProductComparedEnabled) {
      return (
        <div className="c-compare-similar__product__unavailable">
          <span>{'No comparable products available'}</span>
        </div>
      )
    }
    return (
      <div className="c-compare-similar__product__container o-grid">
        <ProductDetailsRowSizeContextProvider>
          <ProductDetailCompareSkeleton attributes={currentItemDisplayFields} />
          {renderCompareItem()}
        </ProductDetailsRowSizeContextProvider>
      </div>
    )
  }

  const addToCartModal = () => {
    if (!selectedCompare?.openModal) return;
    if (!permissions?.enable_purchasing_popup) {
      window.location = '/insightweb/viewCart';
      return;
    }
    return window && window.flags['GNA-11886-ADD-TO-CART-MODAL'] ? (
      <AddItemToCartModal
        currencyCode={currency}
        isLoggedIn={isLoggedIn}
        isOpen={selectedCompare?.openModal}
        onClose={onModalClose}
        products={[selectedCompare?.product]}
        accessories={selectedCompare?.accessories}
        protection={selectedCompare?.protection}
        thirdPartyProtection={selectedCompare?.thirdPartyProtection}
        quantity={selectedCompare?.quantity}
        stock={selectedCompare?.stock}
        isShoppingReqWGEnabled={isShoppingReqWGEnabled}
        permissions={permissions}
        addToCart={async (data,categoryType) => {
          let res = data
          if (Array.isArray(data) && data.length) res = data[0]
          await addToCartItems(res,categoryType)
        }}
        showPrice={!isStockAndPriceDisabled}
        asyncPrice={RRPriceInfo}
        richRelevanceSSEComplete={richRelevanceSSEComplete}
        richRelevanceSSEError={richRelevanceSSEError}
        selectedContract={selectedContract}
        isIPSUserWithContract={isIPSUserWithContract}
      />
    ) : (
      <AddToCartModal
        currencyCode={currency}
        isLoggedOutDefault={!isLoggedIn}
        isOpen={selectedCompare?.openModal}
        onClose={onModalClose}
        hideTabs={false}
        products={[selectedCompare?.product]}
        accessories={selectedCompare?.accessories}
        protection={selectedCompare?.protection}
        thirdPartyProtection={selectedCompare?.thirdPartyProtection}
        quantity={selectedCompare?.quantity}
        stock={selectedCompare?.stock}
        addToCart={async (data,categoryType) => {
          let res = data
          if (Array.isArray(data) && data.length) res = data[0]
          await addToCartItems(res,categoryType)
        }}
        showPrice={!isStockAndPriceDisabled}
      />
    )
  }

  return (
    <div className="c-compare-similar__product">
      {renderProducts()}
      {addToCartModal()}
    </div>
  )
}

export default connectToLocale(CompareProducts)
