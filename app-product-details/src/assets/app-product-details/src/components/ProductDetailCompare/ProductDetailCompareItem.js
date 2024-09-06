import React, { useState, useContext, Fragment } from 'react'
import cn from 'classnames'
import {
  Button,
  connectToLocale,
  Currency,
  QuantitySelector,
  SimpleStockInfo,
  Tooltip,
  ListPrice,
} from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils/lib/labels'
import { getVatPriceProps } from '@insight/toolkit-utils'
import { addToShoppingCartGAE } from '@insight/toolkit-utils/lib/analytics'
import { makeProductDetailURL } from '@insight/toolkit-react/lib/PDPModal/PDPHelpers'
import { getStockFromShoppingReq } from '@insight/toolkit-utils/lib/helpers/getStockFromShoppingReq'
import addToCartRequest from '@insight/toolkit-utils/lib/helpers/addToCartRequest'
import { addToShoppingRequest } from 'app-api-user-service'
import { getShoppingRequestEnabledFlag } from '@insight/toolkit-utils/lib/helpers/getShoppingRequestEnabledFlag'
import PropTypes from 'prop-types'

import { ProductDetailCompareItemRow } from './ProductDetailCompareItemRow'
import { PDPContext } from '../../context'
import { Image } from '../../shared/Image/Image'
import { ADD_TO_CART_CATEGORY_TYPES } from '../../constants'
import { getWebPricingFeatureFlag } from '../../shared'

export const ProductDetailCompareItem = ({
  attributes,
  className,
  context,
  isCurrentItem,
  isShoppingReqWGEnabled,
  name,
  onModalOpen,
  product,
  materialId,
  stock,
  unlimited,
  thumbnailUrl,
  metadata,
  callForPrice,
  currencyCode,
  showBackOrder,
  isStockAndPriceDisabled,
  index
}) => {
  const { addToCart, isLoggedIn, sendSignal, showVAT } = useContext(PDPContext)
  const [quantity, setQuantity] = useState(1)
  const [addToCartState, setAddToCartState] = useState({
    loading: false,
    fulfilled: false,
    rejected: null,
  })
  const isListPriceEnable =
    isLoggedIn && Insight?.webGroupPermissions?.includes('list_price')
  const { locale, permissions } = context
  const { enableViewPricing } = permissions
  const newWebPriceFeature = getWebPricingFeatureFlag()
  const listPrice = product?.price?.listPrice
  const webPrice = product?.price?.webPrice
  const insightPrice = product?.insightPrice
  const webPriceInclVat = product?.price?.webPriceInclVat;

  if (!materialId) return null

  const addItemsToCartTotal = async (quantity) => {
    try {
      setAddToCartState({ ...addToCartState, loading: true })
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
      if (isShoppingCartEnabled) {
        const payload = [
          {
            hasAccessories: false,
            locale,
            materialId,
            quantity,
            warrantyMaterialIds: false,
          },
        ]
        cart = await addToCartRequest(payload, addToShoppingRequest)
        const cartItem = cart.shoppingRequest.cart.cartItems.find(
          (part) => part.materialInfo.materialId == materialId
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
            quantity: 1,
            currency: currencyCode,
            categoryType: ADD_TO_CART_CATEGORY_TYPES.COMPARE_SIMILAR,
          }
          addToShoppingCartGAE(cart.shoppingRequest.cart, [addedCartItem])
        }
      } else {

        // Add current product to cart
        cart = await addToCart(
          {
            materialId,
            quantity,
          },
          isLoggedIn,
          false,
          ADD_TO_CART_CATEGORY_TYPES.COMPARE_SIMILAR,
        )
      }
      const stock = isShoppingCartEnabled
        ? getStockFromShoppingReq(materialId, cart)
        : getStockFromCart(materialId, cart)
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
      setAddToCartState({ ...addToCartState, loading: false })
      onModalOpen(product, quantity, stock)
    } catch (err) {
      setAddToCartState({
        ...addToCartState,
        loading: false,
        error: err.message,
      })
    }
  }

  const getStockFromCart = (materialId, cart) => {
    const item = cart?.cart?.cartItemsForEmail.filter(
      (item) => item.materialID === materialId
    )[0]

    if (item?.nonShipabble) {
      return Infinity
    }

    return item?.stock
  }

  const hasPricing = !callForPrice
  const isLongDescription = name?.length > 65
  const productDescription = isLongDescription
    ? `${name.substring(0, 65)}...`
    : name

  const preparedProductURL = makeProductDetailURL({
    materialId,
    mfrName: product.manufacturerName,
    manufacturerId: product.manufacturerPartNumber,
    description: product.description,
  })

  const renderCTA = () => {
    if (!enableViewPricing) {
      return null
    }
    if (!hasPricing) {
      return (
        <div className="c-product-compare__item__body__cta">
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
      <div className="c-product-compare__item__body__cta o-grid--gutters-small o-grid">
        <div className="o-grid__item u-1/1 u-1/3@tablet">
          <QuantitySelector
            aria-label={t('Quantity')}
            id={`${materialId}_${index}`}
            name={`quantity_${index}`}
            value={quantity}
            size="small"
            min={1}
            max={9999999999}
            onChange={(value) => setQuantity(parseInt(value))}
          ></QuantitySelector>
        </div>
        <div className="o-grid__item u-1/1 u-2/3@tablet">
          <Button
            className={cn(
              'c-button--block',
              'c-product-compare__item__body__cta__size',
              {
                'c-product-compare__item__body__cta__loading':
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
    const tenAttributes = attributes.slice(0, 10)
    return tenAttributes.map((attr) => (
      <div>
        <ProductDetailCompareItemRow rowId={attr.label} key={attr.name}>
          <span>{attr.value}</span>
        </ProductDetailCompareItemRow>
      </div>
    ))
  }

  const renderPricing = () => {
    if (!hasPricing || isStockAndPriceDisabled || !enableViewPricing) {
      return null;
    }

    const displayListPrice = !isLoggedIn || isListPriceEnable;
    const { exclVatProps, inclVatProps } = getVatPriceProps(showVAT);
    return (
      <div className="c-product-compare__item__body__prices">
        {displayListPrice && (
          <ListPrice
            currencyCode={currencyCode}
            listPrice={listPrice}
            insightPrice={webPrice}
            showSaving
            strike
            {...exclVatProps}
          />
        )}
        <div>
          <Currency
            currencyCode={currencyCode}
            value={webPrice}
            className={cn({ 'c-currency__ex-vat': showVAT })}
            {...exclVatProps}
          />
        </div>
        {showVAT &&
          <div>
            <Currency
              currencyCode={currencyCode}
              value={webPriceInclVat}
              {...inclVatProps}
            />
          </div>
        }
      </div>
    )
  }

  const renderAvailability = () => {
    if (hasPricing) {
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

  const renderDescription = () => {
    if (!isLongDescription) return <div>{productDescription}</div>
    return (
      <Fragment>
        <Tooltip content={name} id={`${materialId}_${index}`}>
          <div>{productDescription}</div>
        </Tooltip>
        <div className="u-hide-visually" id={`${materialId}_${index}`}>{productDescription}</div>
      </Fragment>
    )
  }

  return (
    <article
      className={cn(
        'c-product-compare__item o-grid__item u-1/1 u-1/2@tablet u-1/5@desktop',
        {
          current: isCurrentItem,
        },
        className
      )}
    >
      <header className="c-product-compare__item__header">
        <div className="c-product-compare__item__header__product-label">
          {isCurrentItem ? t('Current product') : null}
        </div>
        {isCurrentItem ? (
          <div>
            <div className="c-product-compare__item__header__image">
              <Image src={thumbnailUrl} alt={name} />
            </div>
            {renderDescription()}
          </div>
        ) : (
          <div>
            <Button
              className="c-product-compare__item__header__image"
              color="none"
              href={preparedProductURL}
            >
              <Image src={thumbnailUrl} alt={name} />
            </Button>
            <Button
              className="c-product-compare__item__header__description"
              color="none"
              href={preparedProductURL}
            >
              {renderDescription()}
            </Button>
          </div>
        )}
      </header>
      <div className="c-product-compare__item__body">
        {renderPricing()}
        {renderCTA()}
        <div>
          {renderAvailability()}
          {renderDisplayFieldRows()}
          <ProductDetailCompareItemRow
            rowId="__empty__"
            className="c-product-compare__item__body__empty-row"
          />
        </div>
      </div>
    </article>
  )
}

ProductDetailCompareItem.propTypes = {
  stock: PropTypes.number.isRequired,
  isCurrentItem: PropTypes.bool.isRequired,
  materialId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  thumbnailUrl: PropTypes.string.isRequired,
  metadata: PropTypes.object.isRequired,
  isStockAndPriceDisabled: PropTypes.bool.isRequired,
}
export default connectToLocale(ProductDetailCompareItem)
