import React, { useState } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import get from 'lodash-es/get'
import { IWButton, IWImage } from './../../../../libs/iw-components'
import { l, t, getVatPriceProps } from '@insight/toolkit-utils'
import MorePrices from './morePrices'
import { Currency, PDPModal } from '@insight/toolkit-react'
import { fetchProductInformation } from '../../../../libs/models/Cart/cart'
import { triggerTrackingUrl } from '@insight/toolkit-utils';

const ProductTile = (props) => {
  const [miniPDPMaterialId, setMiniPDPMaterialId] = useState(null)
  const handleButtonClick = () => {
    // Google tracking event
    if (typeof dataLayer !== 'undefined') {
      dataLayer.push({
        event: props.parentComponent,
        materialId: props.materialId || '',
      })
    }
    props.onClick()
  }
  const shouldCallForProductPrice =
    props.price?.priceLabel === 'CALLFORPRICELABEL'
  const { exclVatProps, inclVatProps } = getVatPriceProps(props.showVAT);
  const locale = l();
  const priceInclVat = props.price?.priceInclVat;
  const price = props.price?.price;
  const currency = props.price?.currency.trim();
  const displayInclVat = props.showVAT && priceInclVat;
  const onButtonClick = shouldCallForProductPrice
    ? null
    : props.isInCart
    ? null
    : handleButtonClick
  const buttonText = shouldCallForProductPrice
    ? t('Call for price')
    : props.isInCart
    ? t('Already in cart')
    : t('Add to cart')
  const openMarket = t('OPEN MARKET')
  const openMiniPDP = (materialId) => {
    if (props?.isRecommendedProduct) {
      triggerTrackingUrl(props?.trackingUrl);
    }
    setMiniPDPMaterialId(materialId)
    props.setDraggable()
  }
  const onClose = () => {
    setMiniPDPMaterialId(null)
    props.setDraggable()
  }
  return (
    <section className={`product-tile ${props.className}`}>
      <div className="product-tile__img-wrapper">
        <IWImage
          className="product-tile__img"
          src={props.imageSRC}
          alt={`${props.description}`}
          onClick={() => openMiniPDP(props.materialId)}
        />
      </div>
      <div className="product-tile__name-wrapper">
        <IWButton
          className="iw-button--link product-tile__name"
          onClick={() => openMiniPDP(props.materialId)}
        >
          {props.description}
        </IWButton>
      </div>
      {shouldCallForProductPrice ? (
        <span className="product-tile__price-fill"></span>
      ) : (
        <div>
          {!props.isStockAndPriceDisabled &&
            <div className="product-tile__price">
              <Currency
                currencyCode={currency}
                value={Number(price)}
                className={cn({'product-tile__price__excl-vat':displayInclVat})}
                locale={locale}
                {...exclVatProps}
              />
              { displayInclVat && <Currency
                currencyCode={currency}
                value={Number(priceInclVat)}
                locale={locale}
                {...inclVatProps}
              /> }
            </div>
          }
          {props.price?.contractTitle && (
            <div className="product-tile__contract-title">
              {props.price?.contractTitle === 'OPENMARKETPRICELABEL'
                ? openMarket
                : props.price?.contractTitle}
            </div>
          )}
          {get(props, ['webProduct', 'moreContractInfo'], []).length > 0 &&
            !props.hideAddToCart && (
              <div className="product-tile__more-prices">
                <MorePrices
                  webProduct={props.webProduct}
                  onAddToCart={props.onAddToCartFromMorePrices}
                />
              </div>
            )}
        </div>
      )}
      {!props.hideAddToCart && (
        <IWButton
          type="button"
          className={`small hollow product-tile__button no-margin-bot ${cn({
            disabled: props.isInCart,
          })}`}
          onClick={onButtonClick}
        >
          {buttonText}
        </IWButton>
      )}
      <PDPModal
        showPDP={miniPDPMaterialId ? true : false}
        showBackOrder={true}
        fetchProduct={async () => {
          const res = await fetchProductInformation({
            locale: locale,
            materialId: miniPDPMaterialId,
          })
          return { data: res }
        }}
        onClose={onClose}
        isLoggedIn={props.isLoggedIn}
      />
    </section>
  )
}

ProductTile.propTypes = {
  isInCart: PropTypes.bool,
  imageSRC: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  price: PropTypes.shape({}).isRequired,
  onClick: PropTypes.func,
  onAddToCartFromMorePrices: PropTypes.func,
  webProduct: PropTypes.shape({}), // not required, only used for IPS - more prices
  parentComponent: PropTypes.string,
  materialId: PropTypes.string,
  hideAddToCart: PropTypes.bool.isRequired,
}

ProductTile.defaultProps = {
  hideAddToCart: false,
}

export default ProductTile
