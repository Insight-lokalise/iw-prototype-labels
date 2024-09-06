import React, { useState, useContext, useEffect, Fragment } from 'react';
import cn from 'classnames';
import {
  Button,
  connectToLocale,
  Currency,
  Loading,
  PartNumbers,
  Message,
  Icon,
  Lozenge,
  Tooltip
} from '@insight/toolkit-react'
import { t, addToShoppingCartGAE, triggerTrackingUrl, getVatPriceProps } from '@insight/toolkit-utils'
import addToCartRequest from '@insight/toolkit-utils/lib/helpers/addToCartRequest'
import { addToShoppingRequest } from 'app-api-user-service'
import { getShoppingRequestEnabledFlag } from "@insight/toolkit-utils/lib/helpers/getShoppingRequestEnabledFlag";
import { Image } from '../../shared/Image/Image'
import { PDPContext } from '../../context'
import { getSessionUser } from "../../api/getSessionUser";
import { CONTRACT_LOADING_MESSAGE, CONTRACT_TIMED_OUT_MESSAGE, CALL_FOR_PRICE } from '../../constants'

function ProductDetailTabResource({
  context,
  materialId,
  partNumber,
  shortDescription,
  longDescription,
  cesSpecs,
  price,
  priceInclVat,
  currency,
  icon,
  disableNavLinks,
  image,
  clickTrackingURL,
  categoryType,
  selectedContract,
  callForPrice,
  searchSSEComplete,
  isIPSUserWithContract,
  isMultipleContract
}) {
  const isContractLoading = !searchSSEComplete && !price && isIPSUserWithContract
  const isContractTimedOut = searchSSEComplete && !price && isIPSUserWithContract && !callForPrice;
  const isCallForPrice = searchSSEComplete && !price && isIPSUserWithContract && callForPrice;
  const isBestPriceVisible = price && !callForPrice && isMultipleContract;
  const { locale, permissions } = context
  const { enableViewPricing } = permissions
  const { addToCart, isLoggedIn, setContractId, setMiniPDP, showVAT } = useContext(PDPContext)
  const [addToCartState, setAddToCartState] = useState({
    loading: false,
    fulfilled: false,
    rejected: null,
  })
  const isStockAndPriceDisabled = isLoggedIn ? Insight?.webGroupPermissions?.includes('disable_stock_and_price_display') : false

  useEffect(() => {
    if (!addToCartState.fulfilled) return
    // Set timer to remove added to cart message
    const timer = setTimeout(
      () => setAddToCartState({ loading: false, fulfilled: false }),
      10000
    )
    return () => clearTimeout(timer)
  }, [addToCartState.fulfilled])

  const openMiniPDP = (contractId) => {
    triggerTrackingUrl(clickTrackingURL);
    setMiniPDP(materialId)
    setContractId(contractId)
  }

  const addToCartHandler = async () => {
    try {
      triggerTrackingUrl(clickTrackingURL);
      setAddToCartState({ loading: true, fulfilled: false })
      const { userInformation } = await getSessionUser()
      const webGroupId = userInformation?.webGroup?.webGroupId
      const isShoppingReqWGEnabled = window?.flags['GNA-11686-CES-SHOPPING-CART'].indexOf(webGroupId) !== -1
      const isLoggedOutDefault = window?.flags['GNA-10394-SHOPPING-CART'] && !isLoggedIn && locale.split("_")[1] === 'US'
      const isShoppingCartEnabled = getShoppingRequestEnabledFlag(locale, isLoggedOutDefault, isShoppingReqWGEnabled)
      
      if (isShoppingCartEnabled && !isIPSUserWithContract) {
        const payload = [
          {
            hasAccessories: false,
            locale,
            materialId,
            quantity: 1,
            warrantyMaterialIds: false,
            addToShoppingRequest,
          },
        ]
        // Add current product to shopping req
        const cartData = await addToCartRequest(payload, addToShoppingRequest)
        const cartItem = cartData.shoppingRequest.cart.cartItems.find(part => part.materialInfo.materialId == materialId)
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
            currency: currency,
            categoryType: categoryType
          }
          addToShoppingCartGAE(cartData.shoppingRequest.cart, [addedCartItem])
        }
      } else {
        // Add current resource to cart
        await addToCart({
          materialId,
          quantity: 1,
          ...(isIPSUserWithContract && { contractID: selectedContract?.contractNumber, contractName: selectedContract?.contractName }),
        },
          isLoggedIn,
          false,
          categoryType,
          isIPSUserWithContract
        )
      }
      setAddToCartState({ loading: false, fulfilled: true })
    } catch (err) {
      setAddToCartState({
        loading: false,
        fulfilled: false,
        rejected: err.message,
      })
    }
  }
  const renderDescription = () => {
    if (disableNavLinks) return <span>{shortDescription}</span>
    return (
      <Button
        color="inline-link"
        size="small"
        onClick={() => openMiniPDP(selectedContract?.contractNumber)}
        className="c-product-tabs__product-title--lg"
      >
        {shortDescription}
      </Button>
    )
  }
  const renderAddingToChart = () => {
    if (addToCartState.loading) return <Loading />
    else if (addToCartState.fulfilled) {
      return (
        <Message
          className="c-product-tabs__resource__confirmation__message"
          type="success"
        >
          {t('Added to cart')}
        </Message>
      )
    }
    return null
  }
  const renderSubTitle = () => {
    // Check if ces spec contains a pipe character
    if (cesSpecs && cesSpecs.includes('|')) {
      const cesSpecsArray = cesSpecs.split(/\|/g)
      const bullets = cesSpecsArray?.map((bullet, index) => {
        const showDivider = index !== cesSpecsArray.length - 1
        return (
          <span key={index}>
            {bullet}
            {showDivider ? <span> • </span> : null}
          </span>
        )
      })
      return <div>{bullets}</div>
    } else if (cesSpecs) return cesSpecs
    return longDescription
  }
  const { exclVatProps, inclVatProps } = getVatPriceProps(showVAT);
  const displayVatPrice = showVAT && priceInclVat;

  const renderSelectedContractForIPS = () => {
    return (<div className="o-grid__item u-1/1">
      <div className="c-product-tabs__contract-container">
        <div className='o-grid c-truncate'>
          <div className='u-text-bold c-product-tabs__contract-name u-margin-bot-tiny o-grid--reverse c-list-item__contract'>
            {isContractLoading && (
              <div className='o-grid o-grid--center'>
                <div>{t(CONTRACT_LOADING_MESSAGE)}</div> &nbsp;
                <div className='c-product-tabs__contract-loading-icon'><Loading /></div>
              </div>
            )}
            {isContractTimedOut && (
              <span>{t(CONTRACT_TIMED_OUT_MESSAGE)}</span>
            )}
            {isCallForPrice && (
                <span>{t(CALL_FOR_PRICE)}</span>
            )}
            {price && !callForPrice && (
              (!selectedContract?.contractNumber) ?
                <span>{t('Open market')}</span>
                : <Tooltip content={selectedContract?.abbreviation || selectedContract?.contractName}>
                  <span className='c-text' style={{ webkitBoxOrient: 'vertical' }}>{selectedContract?.abbreviation || selectedContract?.contractName}</span>
                </Tooltip>
            )}
          </div>
        </div>
        {isBestPriceVisible && <div> <span className="c-product-specifications__pricing__your-price__best-price">{t('Best price')}</span> </div>}
      </div>
    </div>)
  }
  return (
    <div className="c-product-tabs__resource o-grid">
      <div className="c-product-tabs__resource__thumbnail o-grid__item u-1/1 u-1/6@tablet">
        {icon ? (
          <Icon icon={icon} />
        ) : (
          <Image src={image?.url} alt={image?.description} />
        )}
      </div>
      <div className="c-product-tabs__resource__content o-grid__item u-1/1 u-3/6@tablet o-grid">
        <div className="c-product-tabs__resource__title o-grid__item u-1/1">
          {renderDescription()}
        </div>
        <div className="c-product-tabs__resource__long-description o-grid__item u-1/1">
          {renderSubTitle()}
        </div>
        <div className="o-grid__item u-1/1">
          <PartNumbers inline insightPart={materialId} mfrPart={partNumber} />
        </div>
        {
            isIPSUserWithContract && <div className="o-grid--gutters o-grid">
            {renderSelectedContractForIPS()}
          </div>
        }
      </div>
      {enableViewPricing && (<Fragment>
        <div className={cn("c-product-tabs__resource__price o-grid__item u-3/6 u-1/6@tablet",
          { 'c-product-tabs__resource__price__vat': displayVatPrice }
        )}>
          {!isStockAndPriceDisabled && price ? (
            <Currency
              value={price}
              currencyCode={currency}
              {...exclVatProps}
            />
          ) : <div />}
          {displayVatPrice && (
            <Currency
              value={priceInclVat}
              currencyCode={currency}
              {...inclVatProps}
            />
          )}
        </div>
        <div className="c-product-tabs__resource__add-to-cart o-grid__item u-3/6 u-1/6@tablet">

          <Button
            color="secondary"
            size="small"
            isDisabled={addToCartState.loading || callForPrice || isContractLoading || isContractTimedOut }
            onClick={addToCartHandler}
          >
            {t('Add to cart')}
          </Button>
          <div className="c-product-tabs__resource__confirmation">
            {renderAddingToChart()}
          </div>
        </div>
      </Fragment>)}

    </div>
  )
}

export default connectToLocale(ProductDetailTabResource)
