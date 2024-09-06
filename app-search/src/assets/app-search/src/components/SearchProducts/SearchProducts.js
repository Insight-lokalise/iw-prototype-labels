import React, { Fragment, useContext, useState, useEffect } from 'react'
import cn from 'classnames'

import {
  Loading,
  AddToCartModal,
  AddItemToCartModal,
  connectToLocale,
} from '@insight/toolkit-react'
import { getUTCTimeStamp, shallowEqual, addToShoppingCartGAE} from '@insight/toolkit-utils'
import { addToShoppingRequest } from 'app-api-user-service'
import { SearchContext } from '../../context/SearchContext'
import { RecommendationsContext } from '../../context/RecommendationsContext'
import addToCartRequest from '@insight/toolkit-utils/lib/helpers/addToCartRequest'
import { getShoppingRequestEnabledFlag } from '@insight/toolkit-utils/lib/helpers/getShoppingRequestEnabledFlag'
import ListItem from './ListItem'
import { ILISTVIEW, solutionProductTile, FF_SOLUTIONS_SEARCH } from '../../constants'
import { addToCart, prepareAddToCartData } from '../../api'
import SolutionsContentProductTile from '../SolutionsContentProductTile'

function SearchProducts({
  context,
  currency,
  view,
  products,
  loading,
  onHandleProductOnClick,
  currentPage,
}) {
  const { docs, priceInfo } = useContext(SearchContext)
  const { prepareRecommendationData, richRelevanceSSEComplete } = useContext(RecommendationsContext)
  const [openModal, setOpenModal] = useState(false)
  const [productsData, setProductsData] = useState(products)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectProductPrice, setSelectProductPrice] = useState(null)
  const [accessories, setAccessories] = useState(null)
  const [protection, setProtection] = useState(null)
  const [RRPriceInfo, setRRPriceInfo] = useState(null)
  const [thirdPartyProtection, setThirdPartyProtection] = useState(null)
  const [quantity, setQuantity] = useState(null)
  const [stock, setStock] = useState(null)
  const { isLoggedIn, isIPSUser, locale, webGroupId, salesOrg, permissions, webGroupPermissions, contract } = context
  const isIPSUserWithContract = isIPSUser && !!contract
  const shouldDisplaySolutionContent =
    window.flags && window.flags[FF_SOLUTIONS_SEARCH]
  const isFirstPageResult = solutionProductTile.showOnlyForPage === currentPage
  const isShoppingReqWGEnabled =
    window?.flags['GNA-11686-CES-SHOPPING-CART'].indexOf(webGroupId) !== -1
    const isStockAndPriceDisabled = isLoggedIn ? webGroupPermissions?.includes('disable_stock_and_price_display') : false
  const checkAndUpdateProductsData = (passedProducts) => {
    // this is done to check if solutions content > 5 & feature flag is enabled then only we need to update the products data
    if (
      docs?.length > 5 &&
      shouldDisplaySolutionContent &&
      passedProducts.length > 0 &&
      isFirstPageResult
    ) {
      const indexToInsertSolutionData = solutionProductTile.indexToInsert
      let solutionsData = docs[solutionProductTile.solutionsTileToPick]
      solutionsData.isContentSlide = true
      if (passedProducts.length > indexToInsertSolutionData - 1) {
        // as per GNA-11699 if products count is greater than 18 content should be between 18 and 19 item else add at the end of data
        let newProductsData = [...passedProducts]
        if (
          !shallowEqual(
            solutionsData,
            newProductsData[indexToInsertSolutionData]
          )
        ) {
          newProductsData.splice(indexToInsertSolutionData, 0, solutionsData)
          setProductsData(newProductsData)
        }
      } else {
        let newProductsData = [...passedProducts]
        const productsDataLength = newProductsData.length
        if (
          !shallowEqual(solutionsData, newProductsData[productsDataLength - 1])
        ) {
          newProductsData.push(solutionsData)
          setProductsData(newProductsData)
        }
      }
    }
  }

  useEffect(() => {
    if (products.length > 0) {
      setProductsData(products)
      checkAndUpdateProductsData(products)
    }
  }, [products, docs])

  const onModalClose = () => {
    setOpenModal(false)
    setSelectedProduct(null)
    setAccessories(null)
    setProtection(null)
    setThirdPartyProtection(null)
    setQuantity(null)
    setStock(null)
  }

  const onModalOpen = ({
    product,
    accessories,
    protection,
    thirdPartyProtection,
    quantity,
    stock,
    priceInfo,
    selectedContract = null
  }) => {
    const convertToProductWarranty = (item) => {
      return {
        productURL: '',
        materialId: item.materialId,
        manuFacturerName: item.manufacturer.name,
        manuIid: item.manufacturer.id,
        manufacturerPartNumber: item.manufacturer.partNumber,
        name: item.descriptions.shortDescription,
        price: item.price.productPrices[0],
        image: item.images.largeImage,
      }
    }
    setSelectedProduct(product)
    setSelectProductPrice(selectedContract)
    setAccessories(accessories)
    setProtection(protection)
    setThirdPartyProtection(thirdPartyProtection?.map(convertToProductWarranty))
    setQuantity(quantity)
    setStock(stock)
    setRRPriceInfo(priceInfo)
    setOpenModal(true)
  }

  const modalAddToCartHandler = async (product,categoryType) => {
    const response = (isIPSUser && !!contract)?
      await prepareRecommendationData(product[0].materialID, locale, salesOrg, currency, contract):
      await prepareAddToCartData(product[0].materialID, locale, salesOrg)

    const hasAccessories = isIPSUserWithContract? response?.recommendationInfo?.hasAccessories : response?.hasAccessories
    const warrantyMaterialIds = isIPSUserWithContract? response?.recommendationInfo?.warrantyMaterialIds : response?.warrantyMaterialIds
    const thirdPartyWarrantyIds = isIPSUserWithContract? response?.recommendationInfo?.thirdPartyWarrantyIds : response?.thirdPartyWarrantyIds
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
          hasAccessories,
          locale,
          materialId: product[0].materialID,
          quantity: product[0].quantity,
          warrantyMaterialIds: warrantyMaterialIds?.concat(
            thirdPartyWarrantyIds
          ), //pass all warranty ids to add to cart so add protection link will show on cart page,
        },
      ]
      const cartData = await addToCartRequest(payload, addToShoppingRequest)
      const cartItem = cartData.shoppingRequest.cart.cartItems.find(
        (part) => part.materialInfo.materialId == product[0].materialID
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
      // Add current product to cartc
      await addToCart([
        {
          materialID: product[0].materialID,
          clientBrowserDate: getUTCTimeStamp(),
          programID: '',
          quantity: 1,
          hasAccessories,
          contractID: product[0]?.contractID,
          warrantyMaterialIds: warrantyMaterialIds?.concat(
            thirdPartyWarrantyIds
          ), //pass all warranty ids to add to cart so add protection link will show on cart page,
        },
      ], categoryType)
    }
  }

  const renderProducts = () => {
    return productsData?.map((product, i) => {
      const isContentSlide = product?.isContentSlide
      const priceInformation = priceInfo?.[product.materialId]
      return isContentSlide ? (
        <SolutionsContentProductTile doc={product} view={view} />
      ) : (
        <ListItem
          index={i}
          key={i}
          currency={currency}
          mockedDetails={product.details}
          onHandleProductOnClick={onHandleProductOnClick}
          onModalOpen={onModalOpen}
          product={product}
          priceInfo={priceInformation}
          view={view}
        />
      )
    })
  }

  const addToCartModal = () => {
    if (!openModal) return;
    if (!permissions.enable_purchasing_popup) {
      window.location = '/insightweb/viewCart';
      return;
    }
    return window && window.flags['GNA-11886-ADD-TO-CART-MODAL'] ? (
      <AddItemToCartModal
        currencyCode={context.currencyCode || currency}
        isLoggedIn={isLoggedIn}
        isOpen={openModal}
        onClose={onModalClose}
        products={[selectedProduct]}
        accessories={accessories}
        protection={protection}
        thirdPartyProtection={thirdPartyProtection}
        quantity={quantity}
        stock={stock}
        addToCart={modalAddToCartHandler}
        isShoppingReqWGEnabled={isShoppingReqWGEnabled}
        showQuantityExceed={false}
        showPrice={!isStockAndPriceDisabled}
        permissions={permissions}
        asyncPrice={{...priceInfo, ...RRPriceInfo}}
        richRelevanceSSEComplete={richRelevanceSSEComplete}
        selectedContract={selectProductPrice}
        isIPSUserWithContract={isIPSUserWithContract}
      />
    ) : (
      <AddToCartModal
        currencyCode={context.currencyCode || currency}
        isLoggedOutDefault={!isLoggedIn}
        isOpen={openModal}
        onClose={onModalClose}
        hideTabs={false}
        products={[selectedProduct]}
        accessories={accessories}
        protection={protection}
        thirdPartyProtection={thirdPartyProtection}
        quantity={quantity}
        stock={stock}
        addToCart={modalAddToCartHandler}
        showQuantityExceed={false}
        showPrice={!isStockAndPriceDisabled}
      />
    )
  }

  return (
    <Fragment>
      {loading && (
        <div className="o-grid o-grid--justify-center u-margin-bot-small">
          <div className="o-grid__item o-grid__item--shrink">
            <Loading size={'large'} />
          </div>
        </div>
      )}
      <div
        className={cn('c-search-products', {
          grid: view === ILISTVIEW.grid,
        })}
      >
        {renderProducts()}
        {addToCartModal()}
      </div>
    </Fragment>
  )
}

export default connectToLocale(SearchProducts)
