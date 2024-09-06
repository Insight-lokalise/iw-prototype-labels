import React, { useCallback, useState, useContext, useEffect } from 'react'
import {
  AddToCartModal,
  connectToLocale,
  AddItemToCartModal,
} from '@insight/toolkit-react'
import { getShoppingRequestEnabledFlag } from '@insight/toolkit-utils/lib/helpers/getShoppingRequestEnabledFlag'
import {
  getCookie,
  setCookie,
} from '@insight/toolkit-utils/lib/helpers/cookieHelpers'
import addToCartRequest from '@insight/toolkit-utils/lib/helpers/addToCartRequest'
import { addToShoppingRequest, isHybridXEnabled } from 'app-api-user-service'
import SpecificationsPricing from './SpecificationsPricing'
import { SpecificationsCart } from './SpecificationsCart'
import { SpecificationsProtectionPlan } from './SpecificationsProtectionPlan'
import { SpecificationsWarranty } from './SpecificationsWarranty'
import { SpecificationsTechOverview } from './SpecificationsTechOverview'
import { SpecificationsLink } from './SpecificationsLink'
import { SpecificationsPropCompliance } from './SpecificationsPropCompliance'
import { SpecificationsVariants } from './SpecificationsVariants'
import { PDPContext, PlacementsContext } from '../../context'
import { getWarrantyMaterialIds } from '../../lib/warranties'
import { getSessionUser } from '../../api/getSessionUser'
import { addToShoppingCartGAE } from '@insight/toolkit-utils'
import { ADD_TO_CART_CATEGORY_TYPES, OPEN_MARKET } from '../../constants'

function ProductDetailsSpecifications({ context }) {
  const {
    product = {},
    addToCart,
    isLoggedIn,
    sendSignal,
  } = useContext(PDPContext)
  const { protection, accessories, thirdPartyProtection, recommendationsPrices, recommendationsSSEComplete } =
    useContext(PlacementsContext)
  const [isShoppingReqWGEnabled, setIsShoppingReqWGEnabled] = useState(false)
  const isStockAndPriceDisabled = isLoggedIn
    ? Insight?.webGroupPermissions?.includes('disable_stock_and_price_display')
    : false

  useEffect(() => {
    logRecentlyViewedProduct(product.materialId)
  }, [])

  useEffect(() => {
    ; (async () => {
      const { userInformation } = await getSessionUser()
      const webGroupId = userInformation?.webGroup?.webGroupId
      setIsShoppingReqWGEnabled(
        window?.flags['GNA-11686-CES-SHOPPING-CART'].indexOf(webGroupId) !== -1
      )
    })()
  }, [])

  const [quantity, setQuantity] = useState(1)
  const [protectPurchase, setProtectPurchase] = useState(false)
  const [addToCartState, setAddToCartState] = useState({
    loading: false,
    fulfilled: false,
    rejected: null,
  })
  const { locale, permissions, isIPSUser, contract } = context
  const isIPSUserWithContract = isIPSUser && !!contract
  const isOpenMarketEnabled = (isLoggedIn && isIPSUser) ? Insight?.userPermissions?.includes('fed_open_market') : false
  const [selectedContract, setSelectedContract] = useState(null)
  const [contracts, setContracts] = useState(null)
  useEffect(() => {
    if (isIPSUserWithContract) {
      const activeContract = contract?.contractName
      const isSingleContract = !product?.price?.additionalPrices
      const contracts = product?.price?.additionalPrices || [{ ...product.price }]
      const filteredContract = isOpenMarketEnabled ? contracts : contracts.filter((c) => c.contractName !== "Open Market")
      setContracts(filteredContract)
      if (isSingleContract) {
        setSelectedContract(activeContract === "openMarket" ? {
          ...product.price,
          contractName: OPEN_MARKET,
          contractNumber: null
        } : { ...product?.price })
      } else {
        setSelectedContract(filteredContract[0]);
      }
    }
  }, [isIPSUserWithContract])

  useEffect(() => {
    if (selectedContract && selectedContract.webPrice) {
      const additionalPrices = product.price.additionalPrices;
      product.price = { ...selectedContract, additionalPrices }
    }
  }, [selectedContract]);

  const { enableViewPricing } = permissions
  const manufacturerList = protection?.prodList || []
  const thirdPartyWarrantyList = thirdPartyProtection || []
  let consolidatedProtectionList = [
    ...manufacturerList,
    ...thirdPartyWarrantyList,
  ]
  const consolidatedProtectionListIds = consolidatedProtectionList?.map((prod) => prod.materialId) || []
  const findWarranty = (materialId) => protection?.prodList?.filter(prod => prod.materialId === materialId)
  let filteredContractIds, displayWarranty, displayWarrantyPrice;
  if (isIPSUserWithContract && !!recommendationsPrices) {
    filteredContractIds = consolidatedProtectionListIds?.filter(materialId => recommendationsPrices[materialId]?.contractNumber === selectedContract?.contractNumber)
    if (filteredContractIds?.length > 0) {
      filteredContractIds?.sort((a, b) => (recommendationsPrices[a]?.webPrice - recommendationsPrices[b]?.webPrice))
      displayWarranty = (findWarranty(filteredContractIds[0]) && findWarranty(filteredContractIds[0]).length != 0) ? findWarranty(filteredContractIds[0])[0] : null
      displayWarrantyPrice = recommendationsPrices[filteredContractIds[0]]
    }
  }
  consolidatedProtectionList.sort((a, b) => a?.price?.price - b?.price?.price)
  // Select protection plan
  const selectedProtectionPlan = isIPSUserWithContract ?
    filteredContractIds?.length ?
      displayWarranty
      : false
    : consolidatedProtectionList?.length
      ? consolidatedProtectionList[0]
      : false

  let availableQuantity = product.availability?.totalQuantity
  const unlimited = product.availability?.unlimited

  // Check if unlimited availability flag is set to true
  if (product.availability?.unlimited) availableQuantity = 99999

  // Create an array of products to add to cart
  let selectedProducts = [{ ...product, quantity }]

  // Add protection plan to array of products if protect purchase is selected
  if (protectPurchase) {
    selectedProducts = [
      ...selectedProducts,
      {
        ...selectedProtectionPlan,
        quantity,
        categoryType: 'protection-plan',
        description:
          selectedProtectionPlan.description || selectedProtectionPlan.name,
      },
    ]
  }
  const handleAddItemsToCart = useCallback(
    async (selectedQuantity) => {
      try {
        setAddToCartState({ loading: true, fulfilled: false, rejected: null })
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
        const warrantyMaterialIds = getWarrantyMaterialIds(
          protection,
          thirdPartyProtection
        )
        // Check if the material has accessories
        const hasAccessories = accessories?.prodList?.length ? true : false
        // Generate add to cart payload
        const productToAdd = {
          materialId: product.materialId,
          hasAccessories,
          quantity,
          warrantyMaterialIds,
          softwareContractId: product?.softwareContractId,
          assortmentId: product?.assortmentId,
          programId: product?.programId,
          contractID: selectedContract?.contractNumber || '',
        }
        // Add warranty info to product if protect purchase is selected
        if (protectPurchase) {
          productToAdd.warrantyDetail = {
            parentMaterialId: product.materialId,
            quantity,
            warrMaterialId: selectedProtectionPlan.materialId,
            contractID: selectedContract?.contractNumber || '',
          }
        }
        if (isShoppingCartEnabled && !isLogoutIPS) {
          const payload = [
            {
              hasAccessories,
              locale,
              materialId: product.materialId,
              quantity,
              warrantyMaterialIds,
              warrantyMaterialId: protectPurchase
                ? selectedProtectionPlan.materialId
                : null,
              warrantyQuantity: protectPurchase ? quantity : 0,
            },
          ]
          // Add current product to shopping req
          const cartData = await addToCartRequest(payload, addToShoppingRequest)
          const cartItem = cartData.shoppingRequest.cart.cartItems.find(
            (part) => part.materialInfo.materialId == product.materialId
          )
          if (cartItem) {
            const addedCartItem = {
              name: cartItem.materialInfo.description,
              id: cartItem.materialInfo.materialId,
              productSku: cartItem.materialInfo.manufacturerPartNumber,
              insightPartId: cartItem.materialInfo.materialId,
              price: cartItem.totalPrice,
              brand: cartItem.materialInfo.manufacturerName,
              category: cartItem.materialInfo.categoryId,
              quantity: selectedQuantity,
              currency: product.price.currency,
              categoryType: ADD_TO_CART_CATEGORY_TYPES.MAIN_ADD_TO_CART,
            }
            addToShoppingCartGAE(cartData.shoppingRequest.cart, [addedCartItem])
          }
        } else {
          // Add current product to cart
          await addToCart(
            productToAdd,
            isLoggedIn,
            false,
            ADD_TO_CART_CATEGORY_TYPES.MAIN_ADD_TO_CART,
            isIPSUserWithContract
          )
        }
        // Open AddToCart modal
        setAddToCartState({ loading: false, fulfilled: true, rejected: null })
      } catch (err) {
        setAddToCartState({
          loading: false,
          fulfilled: false,
          rejected: err.message,
        })
      }

      if (isLoggedIn) {
        // Send primary add to cart CTA signal
        sendSignal([
          {
            type: 'cart',
            materialId: product.materialId,
            sku: product.materialId,
          },
        ])
      }
    },
    [quantity, protection, protectPurchase, selectedContract]
  )

  const addToCartModal = () => {
    if (!addToCartState.fulfilled) return
    if (!permissions.enable_purchasing_popup) {
      window.location = '/insightweb/viewCart'
      return
    }
    return window && window.flags['GNA-11886-ADD-TO-CART-MODAL'] ? (
      <AddItemToCartModal
        enabledWarranty={protectPurchase}
        currencyCode={product.price?.currency}
        isLoggedIn={isLoggedIn}
        isOpen={addToCartState.fulfilled}
        products={selectedProducts}
        permissions={permissions}
        onClose={() => {
          setAddToCartState({ ...addToCartState, fulfilled: false })
        }}
        accessories={accessories}
        protection={protection}
        thirdPartyProtection={thirdPartyProtection}
        quantity={quantity}
        isShoppingReqWGEnabled={isShoppingReqWGEnabled}
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
              categoryType,
              isIPSUserWithContract
            )
          } catch (err) {
            console.warn(`Error adding product to cart`, err)
          }
        }}
        showPrice={!isStockAndPriceDisabled}
        asyncPrice={recommendationsPrices}
        richRelevanceSSEComplete={recommendationsSSEComplete}
        selectedContract={selectedContract}
        isIPSUserWithContract={isIPSUserWithContract}
      />
    ) : (
      <AddToCartModal
        currencyCode={product.price?.currency}
        isLoggedOutDefault={!isLoggedIn}
        isOpen={addToCartState.fulfilled}
        hideTabs={false}
        products={selectedProducts}
        onClose={() => {
          setAddToCartState({ ...addToCartState, fulfilled: false })
        }}
        accessories={accessories}
        protection={protection}
        thirdPartyProtection={thirdPartyProtection}
        quantity={quantity}
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
              categoryType,

            )
          } catch (err) {
            console.warn(`Error adding product to cart`, err)
          }
        }}
        showPrice={!isStockAndPriceDisabled}
      />
    )
  }
  return (
    <div className="c-product-specifications">
      <SpecificationsPricing
        availableQuantity={availableQuantity}
        unlimited={unlimited}
        selectedContract={selectedContract}
        setSelectedContract={setSelectedContract}
        contracts={contracts}
        isOpenMarketEnabled={isOpenMarketEnabled}
      />
      <SpecificationsVariants />
      <SpecificationsCart
        enableViewPricing={enableViewPricing}
        addingToCart={addToCartState.loading}
        availableQuantity={availableQuantity}
        handleAddItemsToCart={handleAddItemsToCart}
        materialId={product.materialId}
        quantity={quantity}
        setQuantity={setQuantity}
        locale={locale}
        disabled={!recommendationsSSEComplete}
      />
      {permissions.enable_warranty_purchase && enableViewPricing && (
        <SpecificationsProtectionPlan
          addingToCart={addToCartState.loading}
          protectPurchase={protectPurchase}
          setProtectPurchase={setProtectPurchase}
          selectedProtectionPlan={selectedProtectionPlan}
          selectedProtectionPrice={displayWarrantyPrice}
          isIPSUserWithContract={isIPSUserWithContract}
          isLoggedIn={isLoggedIn}
        />
      )}
      {permissions.enable_warranty_purchase && enableViewPricing && (
        <SpecificationsWarranty />
      )}
      <SpecificationsTechOverview />
      {permissions.enable_personal_product_list && isHybridXEnabled && (
        <SpecificationsLink
          contractID={selectedContract?.contractNumber}
        />
      )}
      <SpecificationsPropCompliance />
      {addToCartModal()}
    </div>
  )
}

export default connectToLocale(ProductDetailsSpecifications)

const logRecentlyViewedProduct = (materialId) => {
  if (!window.getPrivacySettings().functional) return

  let recentViews = { recentViews: [] }
  const recentViewsCookie = getCookie('recent_views')
  if (recentViewsCookie) {
    recentViews = JSON.parse(decodeURIComponent(recentViewsCookie))
    if (typeof recentViews.recentViews == 'undefined') {
      recentViews = { recentViews: [] }
    }
  }
  const items = recentViews.recentViews
  const inList = items.includes(materialId)
  if (!inList) {
    let nextList = [...items, materialId]
    if (nextList.length > 4) {
      nextList.slice(Math.max(nextList.length - 5, 1))
    }
    recentViews.recentViews = [...nextList]
  }
  setCookie('recent_views', encodeURIComponent(JSON.stringify(recentViews)))
}
