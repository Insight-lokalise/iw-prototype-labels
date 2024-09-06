import React, { useContext, useEffect, useState } from 'react'
import cn from 'classnames'
import {
  Button,
  connectToLocale,
  Field,
  Image,
  PartNumbers,
  SimpleStockInfo,
  Currency
} from '@insight/toolkit-react'
import { makeProductDetailURL } from '@insight/toolkit-react/lib/PDPModal/PDPHelpers'
import { getCurrentLocale, getUTCTimeStamp, t, getWebPrice } from '@insight/toolkit-utils'
import addToCartRequest from '@insight/toolkit-utils/lib/helpers/addToCartRequest'
import { getStockFromShoppingReq } from '@insight/toolkit-utils/lib/helpers/getStockFromShoppingReq'
import {
  addToShoppingRequest,
  sendSignal as sendSignalCall,
} from 'app-api-user-service'
import isMobile from '@insight/toolkit-utils/lib/media/isMobile'
import throttle from '@insight/toolkit-utils/lib/timing/throttle'
import { getPersistCheckoutFromStorage } from '@insight/toolkit-utils/lib/helpers/storageHelpers'
import FallbackImage from '@insight/toolkit-react/lib/Image/FallbackImage'
import { addToShoppingCartGAE } from '@insight/toolkit-utils/lib/analytics'
import { getShoppingRequestEnabledFlag } from '@insight/toolkit-utils/lib/helpers/getShoppingRequestEnabledFlag'
import { ADD_TO_CART_CATEGORY_TYPES, ILISTVIEW } from '../../constants'
import { ListItemDetail } from './ListItemDetail'
import ContractSelection from './ContractSelection'
import CartActions from './CartActions'
import { addToCart, prepareAddToCartData } from '../../api'
import { SearchContext } from '../../context/SearchContext'
import { CompareContext } from '../../context/CompareContext'
import { RecommendationsContext } from '../../context/RecommendationsContext'
import SoftwareContractProrationItem from '../SoftwareContractProrationItem'
import ListItemPriceStock from './ListItemPriceStock'

const locale = getCurrentLocale('insight_locale')

function ListItem({
  context,
  currency,
  index,
  product,
  priceInfo,
  view,
  onModalOpen,
  onHandleProductOnClick,
}) {
  const [isOnMobile, setIsOnMobile] = useState(isMobile())
  useEffect(() => {
    const onResize = throttle(() => {
      setIsOnMobile(isMobile())
    }, 250)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])

  const {
    cdmUid,
    isLoggedIn,
    isIPSUser,
    contract,
    webGroupId,
    sessionId,
    webGroupPermissions,
    showProductImages,
    isHybridXEnabled,
    currencyCode
  } = context
  const { addProduct, compare } = useContext(CompareContext)
  const { prepareRecommendationData } = useContext(RecommendationsContext)
  const isIPSUserWithContract = isIPSUser && !!contract
  const isSingleContract = isIPSUserWithContract && (isLoggedIn && contract?.contractName !== "All" || !isLoggedIn)
  const isMultipleContract = isLoggedIn && contract?.contractName === "All" && isIPSUserWithContract

  const [selectedContract, setSelectedContract] = useState(null)
  const isCallForPrice = isIPSUserWithContract ? priceInfo?.callForPrice : product.callForPrice

  useEffect(() => {
    if (isIPSUserWithContract) {
      setSelectedContract((priceInfo?.additionalPrices && priceInfo.additionalPrices.length > 0) ? priceInfo?.additionalPrices[0] : priceInfo)
    }
  }, [priceInfo])

  const {
    description,
    image,
    materialId,
    manufacturerName,
    manufacturerPartNumber,
    insightPrice,
    price: {webPrice, listPrice, indexPrice, displayDiscount, priceLabel, listPriceInclVat, webPriceInclVat} = {},
    availability,
    availabilityMessage,
    bullet1,
    bullet2,
    bullet3,
    bullet4,
    bullet5,
    proratable,
    unlimited
  } = product
  const {
    fusionQueryId,
    origParams,
    origFacetDisplays,
    searchSource,
    salesOrg,
    signalMetaData,
    searchSSEComplete,
  } = useContext(SearchContext)
  const isContractLoading = !searchSSEComplete && !priceInfo && isIPSUserWithContract
  const isContractTimedOut = searchSSEComplete && !priceInfo && isIPSUserWithContract
  const details = [bullet1, bullet2, bullet3, bullet4, bullet5]
  const productListPrice = isIPSUserWithContract ? selectedContract?.listPrice : listPrice
  const productWebPrice = isIPSUserWithContract ? selectedContract?.webPrice : webPrice
  const productProratable = isIPSUserWithContract ? priceInfo?.proratable : proratable
  const productIndexPrice = isIPSUserWithContract ? selectedContract?.indexPrice : indexPrice
  const productDisplayDiscount = isIPSUserWithContract ? selectedContract?.displayDiscount : displayDiscount
  const isProductComparedEnabled = (isLoggedIn && isIPSUser) ? window?.Insight?.userPermissions?.includes('product_compare') : true
  const preparedProductURL = makeProductDetailURL({
    materialId,
    mfrName: manufacturerName,
    manufacturerId: manufacturerPartNumber,
    description,
  })

  const gotoPDP = async (event) => {
    event.preventDefault()
    await sendSignal('click')
    const analyticsProduct = {
      description,
      materialID: materialId,
      price: getWebPrice({ webPrice, listPrice, insightPrice, isLoggedIn }),
      manufacturerName,
      categoryId: '', // to be checked with Product owner as do not have this in new search result
    }
    onHandleProductOnClick(analyticsProduct, preparedProductURL, index)
    window.location = preparedProductURL
  }

  let approxStockByAvailabilityMessage = 11
  switch (availability) {
    case 'UNAVAILABLE':
      approxStockByAvailabilityMessage = 0
      break
    case 'LIMITED':
      approxStockByAvailabilityMessage = 9
      break
    case 'AVAILABLE':
      approxStockByAvailabilityMessage = 11
      break
  }
  const isAvailable = isHybridXEnabled ? (product?.regularStock > 0 || unlimited) : approxStockByAvailabilityMessage > 0
  const stockNumber = isHybridXEnabled ? product?.regularStock : approxStockByAvailabilityMessage;
  // when is user is in mobile screen, view should always be grid
  const list = view === ILISTVIEW.list && !isOnMobile
  const grid = view === ILISTVIEW.grid || isOnMobile
  const checked = compare?.[`c-${materialId}`]
  let isStockAndPriceDisabled = false;
  if (isIPSUserWithContract) {
    isStockAndPriceDisabled = isLoggedIn ? (!priceInfo || webGroupPermissions?.includes('disable_stock_and_price_display')) : !priceInfo
  } else {
    isStockAndPriceDisabled = isLoggedIn ? webGroupPermissions?.includes('disable_stock_and_price_display') : false
  }
  const sendSignal = (type) => {
    const signalData = {
      type,
      cdmUid,
      index,
      sessionId,
      fusionQueryId,
      signalMetaData,
      origParams,
      origFacetDisplays,
      searchSource,
      salesOrg,
      locale,
      materialId,
    }
    return sendSignalCall([signalData])
  }

  const onViewSimilar = () => {
    window.document.location.href = `${preparedProductURL}#scroll-compare-similar`
  }

  const updateCartToGAE = (cart, materialId, quantity) => {
    // successfully added item // report to datalayer
    const { shoppingRequest } = cart
    const cartItem = shoppingRequest.cart.cartItems.find(
      (part) => part.materialInfo.materialId == materialId
    )
    if (cartItem) {
      const shoppingReqFromStorageObject = getPersistCheckoutFromStorage()
      const addedCartItem = {
        name: cartItem.materialInfo.description,
        id: cartItem.materialInfo.materialId,
        productSku: cartItem.materialInfo.manufacturerPartNumber,
        insightPartId: cartItem.materialInfo.materialId,
        price: cartItem.totalPrice,
        brand: cartItem.materialInfo.manufacturerName,
        category: cartItem.materialInfo.categoryId,
        quantity: quantity || cartItem.quantity,
        currency: shoppingRequest.soldTo.currency,
        categoryType: ADD_TO_CART_CATEGORY_TYPES.MAIN_SEARCH_RESULTS
      }
      addToShoppingCartGAE(shoppingReqFromStorageObject.shoppingRequest.cart, [
        addedCartItem,
      ]) // add new item to dataLayer
    }
  }

  const addItemsToCartTotal = async (quantity) => {
    const response = isIPSUserWithContract ?
      await prepareRecommendationData(materialId, locale, salesOrg, currency, contract) :
      await prepareAddToCartData(materialId, locale, salesOrg, currency)

    const accessories = isIPSUserWithContract ? response?.recommendationInfo?.accessories : response?.accessories
    const hasAccessories = isIPSUserWithContract ? response?.recommendationInfo?.hasAccessories : response?.hasAccessories
    const protection = isIPSUserWithContract ? response?.recommendationInfo?.protection : response?.protection
    const thirdPartyProtection = isIPSUserWithContract ? response?.recommendationInfo?.thirdPartyProtection : response?.thirdPartyProtection
    const warrantyMaterialIds = isIPSUserWithContract ? response?.recommendationInfo?.warrantyMaterialIds : response?.warrantyMaterialIds
    const thirdPartyWarrantyIds = isIPSUserWithContract ? response?.recommendationInfo?.thirdPartyWarrantyIds : response?.thirdPartyWarrantyIds
    const priceInfo = isIPSUserWithContract ? response?.priceInfo : null
    const isShoppingReqWGEnabled =
      window?.flags['GNA-11686-CES-SHOPPING-CART'].indexOf(webGroupId) !== -1
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
          materialId,
          quantity,
          warrantyMaterialIds: warrantyMaterialIds?.concat(
            thirdPartyWarrantyIds
          ), //pass all warranty ids to add to cart so add protection link will show on cart page
        },
      ]
      const cart = await addToCartRequest(payload, addToShoppingRequest)
      updateCartToGAE(cart, materialId, quantity)
      sendSignal('cart')
      const stock = getStockFromShoppingReq(materialId, cart)
      localStorage.setItem('persist:guest:checkout:status', 'true')
      // Need to check for invalid materialID scenario: TODO
      onModalOpen({
        product,
        accessories,
        protection,
        thirdPartyProtection,
        quantity,
        stock,
        priceInfo,
        selectedContract,
      })
    } else {
      const extraRequestPayload = {}
      if (product?.softwareContractId && product?.softwareContractId !== "") {
        extraRequestPayload['assortmentId'] = product?.assortmentId;
        extraRequestPayload['selectedSoftwareContractID'] = product?.softwareContractId;
      } else if (product?.ipsContractId && product?.ipsContractId !== "") {
        extraRequestPayload['contractID'] = product?.ipsContractId;
      }
      extraRequestPayload['programId'] = product?.programId;
      const cart = await addToCart([{
        clientBrowserDate: getUTCTimeStamp(),
        fusionQueryId,
        signalMetaData,
        hasAccessories,
        materialID: materialId,
        warrantyMaterialIds: warrantyMaterialIds?.concat(
          thirdPartyWarrantyIds
        ), //pass all warranty ids to add to cart so add protection link will show on cart page
        quantity,
        contractID: selectedContract?.contractNumber,
        ...extraRequestPayload
      },], ADD_TO_CART_CATEGORY_TYPES.MAIN_SEARCH_RESULTS)
      sendSignal('cart')
      const stock = getStockFromCart(materialId, cart)
      onModalOpen({
        product,
        accessories,
        protection,
        thirdPartyProtection,
        quantity,
        stock,
        priceInfo,
        selectedContract,
      })
    }
  }

  const getStockFromCart = (materialId, cart) => {
    const item = cart.cart.cartItemsForEmail.filter(
      (item) => item.materialID === materialId
    )[0]

    if (item?.nonShipabble) {
      return Infinity
    }

    return item?.stock
  }

  const renderDetails = () => {
    if (grid) return null
    return (
      <div className="c-list-item__details">
        <ListItemDetail detailData={details} />
      </div>
    )
  }

  const renderProductImage = () => {
    if (!showProductImages && grid) return;

    return (
      <section
        className={cn('o-grid__item', {
          'u-1/1 u-1/6@tablet': list,
          'u-1/1': grid,
        })}
      >
        <div className="c-list-item__product-image o-grid">
          {showProductImages && (<div
            className={cn(
              'c-list-item__product-image__container o-grid__item u-1/1',
              { grid: grid }
            )}
          >
            <Button
              color="inline-link"
              href={preparedProductURL}
              onClick={gotoPDP}
            >
              {!!image ? (
                <Image image={image} alt={t(description || 'Product Image')} />
              ) : (
                <FallbackImage altText={t(description || 'Product Image')} />
              )}
            </Button>
          </div>)}
          <div
            className={cn(
              'c-list-item__product-image__compare-container c-list-item__compare o-grid__item u-1/1',
              { grid: grid }
            )}
          >
            {!isOnMobile && list && isProductComparedEnabled && (
              <div>
                <Field
                  name="compare"
                  fieldComponent="Checkbox"
                  checkboxLabel={compareLabel}
                  checked={checked}
                  onChange={() =>
                    addProduct({
                      materialId,
                      image,
                      description,
                      manufacturerPartNumber,
                      manufacturerName,
                      price: getWebPrice({
                        webPrice,
                        listPrice,
                        insightPrice,
                        isLoggedIn,
                      }),
                    })
                  }
                />
              </div>
            )}
          </div>
        </div>
      </section>)
  }

  const renderProductDetails = () => {
    return (
      <section
        className={cn('c-list-item__product-details o-grid__item', {
          'u-1/1 u-3/6@tablet': list,
          'u-1/1': grid,
        })}
      >
        <div className="c-list-item__product-details__info">
          <Button
            className={cn('c-list-item__product-details__info__description', {
              grid,
            })}
            color="inline-link"
            href={preparedProductURL}
            onClick={gotoPDP}
          >
            <span>{description}</span>
          </Button>
          <PartNumbers
            className={cn('c-list-item__part-numbers', {
              list: list,
            })}
            insightPart={materialId}
            mfrPart={manufacturerPartNumber}
          />
        </div>
        {renderDetails()}
        {list && productProratable && (<SoftwareContractProrationItem />)}
      </section>
    )
  }

  const renderStockInfo = () => (
    <section
      className={cn('o-grid__item o-grid', {
        'u-1/1 u-2/6@tablet': list,
        'u-1/1': grid,
      })}
    >
      {/* stock info for list view*/}
      <div className="o-grid__item u-1/1 u-margin-bot-small">
        {list && !isOnMobile && !isCallForPrice && !isStockAndPriceDisabled ? (
          <div className="o-grid o-grid--justify-right c-stock">
            <div className="u-margin-bot-tiny o-grid o-grid--justify-right c-list-item__contract c-list-item__contract-stock">
              <SimpleStockInfo
                className="u-margin-bot-tiny"
                stock={stockNumber}
                showBackOrder={true}
                unlimited={unlimited}
              />
            </div>
            {!isAvailable ? (
              <div className="c-list-item__backorder-message">
                {t('Item will ship when available')}
              </div>
            ) : null}
          </div>
        ) : null}
        {list && isAvailable && false ? (
          <div className="c-list-item__estimated-delivery">
            {t('Get it as soon as')} <strong>{availabilityMessage}</strong>
          </div>
        ) : null}
      </div>
      {
        // contract name, price info and add to cart button section for single contract list view
        !isMultipleContract &&
        (<>
          <div
            className={cn('c-list-item__cart-actions o-grid__item u-1/1', {
              align: list,
            })}
          >
            <CartActions
              index={index}
              currency={currency}
              callForPrice={isCallForPrice}
              isOnMobile={isOnMobile}
              priceInfo={priceInfo}
              listPrice={productListPrice}
              webPrice={productWebPrice}
              indexPrice={productIndexPrice}
              selectedContract={selectedContract}
              isIPSUserWithContract={isIPSUserWithContract}
              isMultipleContract={isMultipleContract}
              isSingleContract={isSingleContract}
              priceLabel={priceLabel}
              insightPrice={insightPrice}
              inclVatPrice={listPriceInclVat}
              displayDiscount={productDisplayDiscount}
              view={view}
              materialId={materialId}
              onViewSimilar={onViewSimilar}
              onAddToCart={addItemsToCartTotal}
              stockNumber={stockNumber}
              showPriceAndStock={!isStockAndPriceDisabled}
              proratable={productProratable}
              unlimited={unlimited}
              isContractLoading={isContractLoading}
              isContractTimedOut={isContractTimedOut}
              listPriceInclVat={listPriceInclVat}
              webPriceInclVat={webPriceInclVat}
            />
          </div>
          {grid && isProductComparedEnabled && (
            <div className="c-list-item__product-image__container c-list-item__compare o-grid__item u-1/1">
              <Field
                name="compare"
                fieldComponent="Checkbox"
                checkboxLabel={compareLabel}
                checked={checked}
                onChange={() =>
                  addProduct({
                    materialId,
                    image,
                    description,
                    manufacturerPartNumber,
                    manufacturerName,
                    price: getWebPrice({
                      webPrice,
                      listPrice,
                      insightPrice,
                      isLoggedIn,
                    }),
                  })
                }
              />
            </div>
          )}
        </>)
      }
    </section>
  )

  const renderCartActions = () => {
    return (
      <section className='o-grid__item o-grid u-1/1'>
        { // contract selection section for multi contract
          // contains both mobile view and list view
          isMultipleContract && !isCallForPrice &&
          <ContractSelection
            priceInfo={priceInfo}
            view={view}
            locale={locale}
            currency={currency}
            selectedContract={selectedContract}
            setSelectedContract={setSelectedContract}
            isContractLoading={isContractLoading}
            isContractTimedOut={isContractTimedOut}
            materialId={materialId}
          />}
        { /* contract name, price info and add to cart button section for multi contract list view 
          add to cart button section for grid view */
        }
        <div
          className={cn('c-list-item__cart-actions o-grid__item u-1/1', {
            align: list,
          })}
        >
          <CartActions
            index={index}
            currency={currency}
            callForPrice={isCallForPrice}
            isOnMobile={isOnMobile}
            priceInfo={priceInfo}
            listPrice={productListPrice}
            webPrice={productWebPrice}
            indexPrice={productIndexPrice}
            selectedContract={selectedContract}
            isIPSUserWithContract={isIPSUserWithContract}
            isMultipleContract={isMultipleContract}
            isSingleContract={isSingleContract}
            priceLabel={priceLabel}
            insightPrice={insightPrice}
            inclVatPrice={listPriceInclVat}
            displayDiscount={productDisplayDiscount}
            view={view}
            materialId={materialId}
            onViewSimilar={onViewSimilar}
            onAddToCart={addItemsToCartTotal}
            stockNumber={stockNumber}
            showPriceAndStock={!isStockAndPriceDisabled}
            proratable={productProratable}
            unlimited={unlimited}
            isContractLoading={isContractLoading}
            isContractTimedOut={isContractTimedOut}
            listPriceInclVat={listPriceInclVat}
            webPriceInclVat={webPriceInclVat}
          />
        </div>
        {grid && isProductComparedEnabled && (
          <div className="c-list-item__product-image__container c-list-item__compare o-grid__item u-1/1">
            <Field
              name="compare"
              fieldComponent="Checkbox"
              checkboxLabel={compareLabel}
              checked={checked}
              onChange={() =>
                addProduct({
                  materialId,
                  image,
                  description,
                  manufacturerPartNumber,
                  manufacturerName,
                  price: getWebPrice({
                    webPrice,
                    listPrice,
                    insightPrice,
                    isLoggedIn,
                  }),
                })
              }
            />
          </div>
        )}
      </section>
    )
  }

  const compareLabel = t('Compare')
  return (
    <div className="c-list-item o-grid">
      {list && <>
        {renderProductImage()}
        {renderProductDetails()}
        {/**stock info for list view and
         * normal contract name, price info and add to cart button section) for list view*/}
        {renderStockInfo()}
        {/**multi contract(contract name, price info and add to cart button section) for list view*/}
        {isMultipleContract && renderCartActions()}
      </>}
      {grid && (
        <>
          <div className="o-grid__item--top">
            {renderProductImage()}
            {renderProductDetails()}
          </div>
          {/*(contract name, price, stock info and add to cart button section) for grid view*/}
          <div className="o-grid__item--bottom">
            { //proration message for grid view
              productProratable && <SoftwareContractProrationItem />
            }
            {/*(contract name, price and stock info section) for grid view*/}
            <ListItemPriceStock
              callForPrice={isCallForPrice}
              currency={currency}
              insightPrice={insightPrice}
              listPrice={productListPrice}
              webPrice={productWebPrice}
              indexPrice={productIndexPrice}
              selectedContract={selectedContract}
              priceInfo={priceInfo}
              listPriceInclVat={listPriceInclVat}
              webPriceInclVat={webPriceInclVat}
              displayDiscount={productDisplayDiscount}
              priceLabel={priceLabel}
              stockNumber={stockNumber}
              showPriceAndStock={!isStockAndPriceDisabled}
              unlimited={unlimited}
              view={view}
              isOnMobile={isOnMobile}
              isIPSUserWithContract={isIPSUserWithContract}
              isMultipleContract={isMultipleContract}
              isSingleContract={isSingleContract}
              isContractLoading={isContractLoading}
              isContractTimedOut={isContractTimedOut}
            />
            {/* contract selection and add to cart button section for grid view */}
            {renderCartActions()}
          </div>
        </>
      )}
    </div>
  )
}

export default connectToLocale(ListItem)
