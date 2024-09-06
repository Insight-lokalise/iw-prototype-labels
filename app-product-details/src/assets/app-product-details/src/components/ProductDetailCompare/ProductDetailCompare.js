import React, { useContext, useState, useEffect } from 'react'
import {
  AddToCartModal,
  connectToLocale,
  AddItemToCartModal,
} from '@insight/toolkit-react'
import { t, isDesktop, throttle } from '@insight/toolkit-utils'
import listen from '@insight/toolkit-utils/lib/events/listen'
import { isHybridXEnabled } from 'app-api-user-service'
import { ProductDetailsRowSizeContextProvider } from '../ProductDetailsRowSizeContext'
import ProductDetailCompareItem from './ProductDetailCompareItem'
import { ProductDetailCompareSkeleton } from './ProductDetailCompareSkeleton'
import PlacementsContext from '../../context'
import { PDPContext, CompareSimilarContext } from '../../context'
import { getNonIpsRecommendations } from '../../api/getNonIpsRecommendations'
import { scrollIntoView } from './../../shared/UIContext/utils/scrollIntoView'

function ProductDetailsCompare({ context }) {
  const [selectedCompare, setCompare] = useState(null)
  const [isOnDesktop, setIsOnDesktop] = useState(isDesktop())

  const { product = {}, addToCart, isLoggedIn } = useContext(PDPContext)
  const { similarProducts } = useContext(CompareSimilarContext)
  const { locale, permissions, userInformation, isIPSUser, salesOrg } = context
  if (isIPSUser) return null
  const webGroupId = userInformation?.webGroup?.webGroupId
  const isCES = userInformation?.isCES
  const isShoppingReqWGEnabled =
    window?.flags['GNA-11686-CES-SHOPPING-CART'].indexOf(webGroupId) !== -1
  const isStockAndPriceDisabled = isLoggedIn
    ? Insight?.webGroupPermissions?.includes('disable_stock_and_price_display')
    : false

  useEffect(() => {
    const onResize = throttle(() => {
      setIsOnDesktop(isDesktop())
    }, 250)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])

  useEffect(() => {
    return listen('cnet:rendered', () => {
      const locationHash = window.location.hash
      const hashArray = locationHash.split('#')
      const scrollArray = hashArray.filter((i) => i.includes('scroll-'))
      const lastHash = scrollArray.pop()
      if (!!lastHash) scrollIntoView(lastHash.replace('scroll-', ''))
    })
  }, [window.location.hash])

  if (!product || !isOnDesktop) return null

  const hasCompareProducts = similarProducts?.products?.length > 1

  const currentItemDisplayFields = hasCompareProducts
    ? similarProducts.products[0].displayFields
    : null

  const availabilityToQuantity = (availability) => {
    if (availability === 'AVAILABLE') return 11
    else if (availability === 'LIMITED') return 9
    return 0
  }

  const onModalClose = () => setCompare(null)

  const onModalOpen = async (product, quantity, stock) => {
    const { accessories, protection, thirdPartyProtection } =
      await getNonIpsRecommendations(product.sku, false, salesOrg)
    setCompare({
      product: {
        ...product,
        materialId: product.sku,
      },
      quantity,
      stock,
      openModal: true,
      accessories,
      protection,
      thirdPartyProtection,
    })
  }

  const renderCompareItem = () => {
    return similarProducts?.products?.map((similarProduct, index) => {
      const stock = isHybridXEnabled(isLoggedIn, isCES)
        ? similarProduct?.regularStock
        : availabilityToQuantity(similarProduct?.availability)
      return (
        <ProductDetailCompareItem
          product={similarProduct}
          key={similarProduct.sku}
          materialId={similarProduct.sku}
          name={similarProduct.description || similarProduct.longDescription}
          thumbnailUrl={similarProduct.image}
          attributes={similarProduct.displayFields}
          stock={stock}
          unlimited={similarProduct.unlimited}
          isCurrentItem={product.materialId === similarProduct.sku}
          onModalOpen={onModalOpen}
          metadata={similarProducts}
          callForPrice={similarProduct.callForPrice}
          currencyCode={similarProducts?.currency}
          showBackOrder={true}
          isShoppingReqWGEnabled={isShoppingReqWGEnabled}
          isStockAndPriceDisabled={isStockAndPriceDisabled}
          index={index}
        />
      )
    })
  }

  const addToCartModal = () => {
    if (!selectedCompare?.openModal) return
    if (!permissions.enable_purchasing_popup) {
      window.location = '/insightweb/viewCart'
      return
    }
    return window && window.flags['GNA-11886-ADD-TO-CART-MODAL'] ? (
      <AddItemToCartModal
        currencyCode={similarProducts?.currency}
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
        showPrice={!isStockAndPriceDisabled}
        permissions={permissions}
        addToCart={async (data, categoryType) => {
          try {
            let res = data
            if (Array.isArray(data) && data.length) res = data[0]
            // Add current product to cart
            await addToCart(
              {
                ...res,
                materialId: res.materialID || res.materialId,
              },
              isLoggedIn,
              false,
              categoryType
            )
          } catch (err) {
            console.warn(`Error adding product to cart`, err)
          }
        }}
      />
    ) : (
      <AddToCartModal
        currencyCode={similarProducts?.currency}
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
        showPrice={!isStockAndPriceDisabled}
        addToCart={async (data, categoryType) => {
          try {
            let res = data
            if (Array.isArray(data) && data.length) res = data[0]
            // Add current product to cart
            await addToCart(
              {
                ...res,
                materialId: res.materialID || res.materialId,
              },
              isLoggedIn,
              false,
              categoryType
            )
          } catch (err) {
            console.warn(`Error adding product to cart`, err)
          }
        }}
      />
    )
  }

  return (
    <>
      {hasCompareProducts && <section id="compare-similar" className="c-product-compare">
        <h5 variant="heading">{t('Compare similar')}</h5>
        <div className="c-product-compare__container o-grid">
          <ProductDetailsRowSizeContextProvider>
            <ProductDetailCompareSkeleton
              attributes={currentItemDisplayFields}
            />
            {renderCompareItem()}
          </ProductDetailsRowSizeContextProvider>
        </div>
        {addToCartModal()}
      </section>}
    </>
  )
}

export default connectToLocale(ProductDetailsCompare)
