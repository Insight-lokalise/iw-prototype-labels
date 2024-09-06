import React, { useContext, useState } from 'react'
import cn from 'classnames'
import {
  Button,
  connectToLocale,
  Currency,
  ListPrice,
  QuantitySelector,
  SimpleStockInfo,
  Tooltip
} from '@insight/toolkit-react'
import { isEmeaRegion, t } from '@insight/toolkit-utils'
import { getStockFromShoppingReq } from '@insight/toolkit-utils/lib/helpers/getStockFromShoppingReq'
import PropTypes from 'prop-types'
import { makeProductDetailURL } from '@insight/toolkit-react/lib/PDPModal/PDPHelpers'
import {
  addToShoppingCartGAE,
  productOnClickGAE,
} from '@insight/toolkit-utils/lib/analytics'
import addToCartRequest from '@insight/toolkit-utils/lib/helpers/addToCartRequest'
import { getPersistCheckoutFromStorage } from '@insight/toolkit-utils/lib/helpers/storageHelpers'
import { addToShoppingRequest, addFieldsForHybridX } from 'app-api-user-service'
import { getShoppingRequestEnabledFlag } from '@insight/toolkit-utils/lib/helpers/getShoppingRequestEnabledFlag'
import { ProductDetailCompareItemRow } from './ProductDetailCompareItemRow'
import { CompareSimilarContext } from '../context/compare'
import { getPlacements } from '../api/getPlacements'
import { Image } from '../shared/Image/Image'
import { getWarrantyMaterialIds } from '../../lib/warranties'
import CompareProductIPSOptions from './CompareProductIPSOptions'
import { ADD_TO_CART_CATEGORY_TYPES, PLACEMENT_IDS } from '../constants'
import { RecommendationsContext } from '../context/RecommendationsContext'

function ProductDetailCompareItem({
  attributes,
  callForPrice,
  className,
  context,
  name,
  onModalOpen,
  product,
  materialId,
  stock,
  unlimited,
  thumbnailUrl,
  metadata,
  currencyCode,
  showBackOrder,
  isShoppingReqWGEnabled,
  isStockAndPriceDisabled
}) {
  const { addToCart, sendSignal } = useContext(CompareSimilarContext)
  const { prepareRecommendationData, setContract } = useContext(RecommendationsContext)
  const [quantity, setQuantity] = useState(1)
  const [addToCartState, setAddToCartState] = useState({
    loading: false,
    fulfilled: false,
    rejected: null,
  })
  const { isLoggedIn, locale, userInformation, isIPSUser, contract, sessionId, salesOrg } = context;
  const ipsUserWithContract = isIPSUser && !!contract
  const [selectedContract, setSelectedContract] = useState((ipsUserWithContract) ? (!!product?.price?.additionalPrices ? product?.price?.additionalPrices[0] : product?.price) : null)
  const permissions = userInformation?.permissions;
  const isSingleContract = !(contract?.name == 'All' && isIPSUser);
  const enableViewPricing = permissions?.enableViewPricing || !isLoggedIn;
  const hasViewPricingDisabled = isLoggedIn && !enableViewPricing;
  const isListPriceEnable = isLoggedIn && Insight?.webGroupPermissions?.includes('list_price');
  if (!materialId) return null

  const newWebPriceFeature =
    window.flags && window.flags['GNA-11926-NEW-WEB-PRICING'];
  const isBestPrice = product?.price?.additionalPrices?.length > 0 && product?.price?.contractNumber === selectedContract?.contractNumber;
  const contractName = selectedContract?.abbreviation || selectedContract?.contractName || 'Open Market'
  const trimContractName = () => {
    if (contractName.length > 50) {
      return isBestPrice ? contractName.substring(0, 40) + '...' : contractName.substring(0, 50) + '...'
    } else {
      return contractName
    }
  }
  const vertical = !isBestPrice ? { webkitBoxOrient: 'vertical' } : { display: 'inherit' };
  const displayContractName = (
    <div>
      <Tooltip
        position="bottom"
        content={selectedContract?.abbreviation || selectedContract?.contractName || 'Open Market'}
      >
        <span style={vertical} className="c-compare-similar__product__item__body__contract__selected-contract">{trimContractName()}</span>
      </Tooltip>
      {isBestPrice && <span className="is-best-price">Best price</span>}
    </div>
  )
  const getPrice = (ipsPrice, defaultPrice) => {
    return (ipsUserWithContract) ? ipsPrice : defaultPrice
  }
  const listPrice = getPrice(selectedContract?.listPrice, product?.price?.listPrice);
  const webPrice = getPrice(selectedContract?.webPrice, product?.price?.webPrice);
  const webPriceInclVat = getPrice(selectedContract?.webPriceInclVat, product?.price?.webPriceInclVat);
  const indexPrice = Number(selectedContract?.indexPrice || 0);
  const showVAT = isEmeaRegion();
  const showSaving = indexPrice > webPrice || listPrice > webPrice;
  const showDiscount = (!!selectedContract?.displayDiscount && ipsUserWithContract && showSaving) || false;

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
        categoryType: ADD_TO_CART_CATEGORY_TYPES.PRODUCT_COMPARE
      }
      addToShoppingCartGAE(shoppingReqFromStorageObject.shoppingRequest.cart, [
        addedCartItem,
      ]) // add new item to dataLayer
    }
  }

  const addItemsToCartTotal = async (quantity) => {
    /*** FOR IPS RECOMMENDATIONS PAYLOAD ***/
    const soldTo = userInformation?.account?.soldToId
    const webGroup = userInformation?.webGroup.webGroupId
    const userId = userInformation?.webLoginProfileId
    const isCES = userInformation?.isCES
    const contractID = selectedContract?.contractNumber || ''
    const contractType = selectedContract?.contractName === 'Open Market' ? 'openMarket' : selectedContract?.contractName
    const productId = materialId
    const isLogoutIPS = window?.flags && window?.flags["GNA-12345-LOGGEDOUT-E4-IPS"]
    const params = {
      locale,
      salesOrg,
      currencyCode,
      materialId,
      soldTo,
      sessionId,
      productId,
      ...((isLoggedIn && soldTo && webGroup) && {
        soldTo,
        webGroup,
        userId
      }),
      contractId: contractID,
      contractType,
      "placementIds": PLACEMENT_IDS,
    }
    await addFieldsForHybridX({ isLoggedIn, isCES }, params)
    try {
      setAddToCartState({ ...addToCartState, loading: true })
      const isIPSwithContract = isIPSUser && !!selectedContract
      if (isIPSwithContract) {
        setContract(selectedContract)
      }
      const selectedContractId = contract?.contractId ?? ''
      params['selectedContractId'] = selectedContractId
      params['ipsUser'] = ipsUserWithContract
      const placements = isIPSwithContract ? await Promise.resolve(prepareRecommendationData(params)) : await getPlacements(materialId)
      const { accessories, protection, thirdPartyProtection } = placements
      const hasAccessories = accessories?.prodList?.length > 0

      const warrantyMaterialIds = getWarrantyMaterialIds(
        protection,
        thirdPartyProtection
      )
      const isLoggedOutDefault =
        window?.flags['GNA-10394-SHOPPING-CART'] &&
        !isLoggedIn &&
        locale.split('_')[1] === 'US'
      const isShoppingCartEnabled = getShoppingRequestEnabledFlag(
        locale,
        isLoggedOutDefault,
        isShoppingReqWGEnabled
      )
      let cart
      if (isShoppingCartEnabled && !isLogoutIPS) {
        const payload = [
          {
            hasAccessories,
            locale,
            materialId,
            quantity,
            warrantyMaterialIds,
          },
        ]
        cart = await addToCartRequest(payload, addToShoppingRequest)
        updateCartToGAE(cart, materialId, quantity)
      } else {
        cart = await addToCart({
          hasAccessories,
          materialId,
          warrantyMaterialIds,
          quantity,
          locale,
          contractType,
          contractID,
        }, ADD_TO_CART_CATEGORY_TYPES.PRODUCT_COMPARE)
      }
      // Send compare cart signal
      sendSignal([
        {
          type: 'cart',
          ctype: 'compare',
          fusionQueryId: metadata.fusionQueryId,
          query: metadata.origParams?.q,
          materialId,
          docId: materialId,
        },
      ])
      const stock = (isShoppingCartEnabled && !isLogoutIPS)
        ? getStockFromShoppingReq(materialId, cart)
        : getStockFromCart(materialId, cart)
      onModalOpen({
        product,
        accessories,
        protection,
        thirdPartyProtection,
        quantity,
        stock,
        selectedContract
      })
      setAddToCartState({ ...addToCartState, loading: false })
    } catch (error) {
      setAddToCartState({
        ...addToCartState,
        loading: false,
        error: error.message,
      })
    }
  }

  const gotoPDP = async (event) => {
    event.preventDefault()
    const analyticsProduct = {
      description: name,
      materialID: materialId,
      price: webPrice,
      manufacturerName: product.manufacturerName,
      categoryId: '', // to be checked with Product owner as do not have this in new search result
    }

    productOnClickGAE(analyticsProduct, preparedProductURL, 'Compare Similar')
    window.location = preparedProductURL
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
  const hasPricing = !!selectedContract ? !selectedContract?.callForPrice : !callForPrice
  const preparedProductURL = makeProductDetailURL({
    materialId,
    mfrName: product.manufacturerName,
    manufacturerId: product.manufacturerPartNumber,
    description: name,
  })

  const renderCTA = () => {
    if (hasViewPricingDisabled) {
      return null
    }
    if (!hasPricing) {
      return (
        <div className="c-compare-similar__product__item__body__cta">
          <Button
            className="c-button--block"
            color="primary"
            size="small"
            isDisabled
          >
            {t('Add to cart')}
          </Button>
        </div>
      )
    }
    return (
      <div className="c-compare-similar__product__item__body__cta o-grid--gutters-small o-grid">
        <div className="o-grid__item u-1/1 u-1/3@tablet">
          <QuantitySelector
            aria-label={t('Quantity')}
            id={materialId}
            name="quantity"
            value={quantity}
            size="small"
            min={1}
            max={9999999999}
            onChange={(value) => setQuantity(parseInt(value))}
            isDisabled={addToCartState.loading}
          ></QuantitySelector>
        </div>
        <div className="o-grid__item u-1/1 u-2/3@tablet">
          <Button
            className={cn(
              'c-button--block',
              'c-compare-similar__product__item__body__cta__size',
              {
                'c-compare-similar__product__item__body__cta__loading':
                  addToCartState.loading,
              }
            )}
            color="primary"
            size="small"
            onClick={() => addItemsToCartTotal(quantity)}
            isDisabled={addToCartState.loading}
            isLoading={addToCartState.loading}
          >
            {t('Add to cart')}
          </Button>
        </div>
      </div>
    )
  }

  const renderDisplayFieldRows = () => {
    if (!attributes?.length) return null
    return attributes.map((attr, index) => (
      <div key={index}>
        <ProductDetailCompareItemRow rowId={attr.label} key={attr.name}>
          <span>{attr.value}</span>
        </ProductDetailCompareItemRow>
      </div>
    ))
  }
  const renderPricing = () => {
    if (hasPricing && !isStockAndPriceDisabled && !hasViewPricingDisabled) {
      const displayListPrice = !isLoggedIn || isListPriceEnable || isIPSUser;
      const listprice = (
        <div className={cn('c-compare-similar__product__item__body__prices', { 'c-compare-similar__product__item__body__prices__vat': showVAT })}>
          {displayListPrice && (
            <ListPrice
              currencyCode={currencyCode}
              listPrice={listPrice}
              indexPrice={indexPrice}
              showListPriceLabel={ipsUserWithContract}
              insightPrice={webPrice}
              showSaving={showDiscount}
              showDiscount={showDiscount}
              strike
              tax={false}
              showVAT={showVAT}
            />
          )}
          <div>
            <Currency
              currencyCode={currencyCode}
              value={webPrice}
              className="c-currency__price-value"
              tax={false}
              showVAT={showVAT}
            />
          </div>
          {showVAT &&
            <div>
              <Currency
                currencyCode={currencyCode}
                value={webPriceInclVat}
                tax
                showVAT={showVAT}
              />
            </div>
          }
        </div>
      )
      if (isIPSUser && !!selectedContract) {
        return (
          <div className="c-compare-similar__product__item__body__contract">
            {displayContractName}
            {listprice}
          </div>
        )
      }
      return listprice
    }
    if (isLoggedIn && isIPSUser && isStockAndPriceDisabled && !selectedContract?.callForPrice) {
      return (
        <div className="c-compare-similar__product__item__body__contract">
          {displayContractName}
        </div>
      )
    }
    return <div />
  }
  const renderIPSContracts = () => {
    return (
      <div className={cn('c-compare-similar__product__item__body__contract__options', { "is-single-contract": isSingleContract })}>
        {!isSingleContract &&
          <CompareProductIPSOptions
            isStockAndPriceDisabled={isStockAndPriceDisabled}
            options={product?.price?.additionalPrices}
            setSelectedContract={setSelectedContract}
            selectedContract={selectedContract}
            locale={locale}
            isLoggedIn={isLoggedIn}
            isIPSUser={isIPSUser}
          />
        }

      </div>
    )
  }
  const renderAvailability = () => {
    if (hasPricing && !isStockAndPriceDisabled) {
      return (
        <div>
          <ProductDetailCompareItemRow rowId="availability">
            <span>
              <SimpleStockInfo
                stock={stock}
                unlimited={unlimited}
                showBackOrder={showBackOrder}
              />
            </span>
          </ProductDetailCompareItemRow>
        </div>
      )
    }
    return (
      <div>
        <ProductDetailCompareItemRow rowId="availability">
          <span>{''}</span>
        </ProductDetailCompareItemRow>
      </div>
    )
  }

  return (
    <article
      className={cn(
        'c-compare-similar__product__item o-grid__item u-1/5',
        className
      )}
    >
      <header className="c-compare-similar__product__item__header">
        <div>
          <Button
            color="none"
            className="c-compare-similar__product__item__header__image"
            href={preparedProductURL}
            onClick={gotoPDP}
          >
            <Image src={thumbnailUrl} alt={name} />
          </Button>
          <Button
            className="c-compare-similar__product__item__header__description"
            color="inline-link"
            href={preparedProductURL}
            onClick={gotoPDP}
            title={name}
            style={{ webkitBoxOrient: 'vertical' }}
          >
            {name}
          </Button>
        </div>
      </header>
      <div className="c-compare-similar__product__item__body">
        {renderPricing()}
        {isIPSUser && renderIPSContracts()}
        {renderCTA()}
        <div>
          {renderAvailability()}
          {renderDisplayFieldRows()}
          <ProductDetailCompareItemRow
            rowId="__empty__"
            className="c-compare-similar__product__item__body__empty-row"
          />
        </div>
      </div>
    </article>
  )
}

ProductDetailCompareItem.propTypes = {
  stock: PropTypes.number.isRequired,
  materialId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  thumbnailUrl: PropTypes.string.isRequired,
}

export default connectToLocale(ProductDetailCompareItem)
