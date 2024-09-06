import React from 'react'
import {
  Button,
  Locale,
  Product,
  SimpleStockInfo,
} from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'

export function ProductListItem({ product }) {
  const {
    materialId,
    productClassName,
    description,
    productImage,
    detailsLink,
    lineLimit,
    manufacturerPartNumber,
    isCallForPrice,
    isEMEA,
    currencyCode,
    listPrice,
    price,
    vatPrice,
    showListPrice,
    inventoryBlowOut,
    availabilityMessage,
    ctaClassName,
    ctaLink,
    ctaText,
    buttonType,
    showMfrPart,
    showStock,
    locale,
    approxStockByAvailabilityMessage,
    isCES,
    isStockAndPriceDisabled
  } = product
  return (
    <Product key={materialId} className={productClassName}>
      <div className="c-product__layout-image">
        <a href={detailsLink}>
          <Product.Image alt={description} image={productImage} />
        </a>
      </div>
      <div className={'c-product__info c-product__layout-info'}>
        <Product.Info.Name
          lineLimit={lineLimit}
          href={detailsLink}
          className="u-clearfix"
        >
          {description}
        </Product.Info.Name>
        {showMfrPart == 'true' && manufacturerPartNumber && (
          <div className="c-product__mfr-part">
            {t('Mfr #')}: {manufacturerPartNumber}
          </div>
        )}
        {!isStockAndPriceDisabled &&
          <Locale value={{ locale }}>
            <Product.Info.Price
              isEMEA={isEMEA}
              listPrice={listPrice}
              currencyCode={currencyCode}
              price={price}
              vatPrice={vatPrice}
              showListPrice={showListPrice}
              isCallForPrice={isCallForPrice}
            />
          </Locale>
        }
        {inventoryBlowOut && (
          <Product.Info.Banner className={'ribbon ribbon-top-left'}>
            {t('Inventory Blowout')}
          </Product.Info.Banner>
        )}
        {!isStockAndPriceDisabled && showStock == 'true' &&
          manufacturerPartNumber &&
          (isCES ? (
            <div className="u-margin-bot-small c-product-stock">
              <SimpleStockInfo
                stock={approxStockByAvailabilityMessage}
                unlimited={false}
                showBackOrder={true}
              />
            </div>
          ) : (
            <Product.Info.Stock>{availabilityMessage}</Product.Info.Stock>
          ))}
        <Button
          className={ctaClassName}
          color={buttonType}
          href={ctaLink}
          data-materialid={materialId}
          data-image-url={productImage}
          aria-label={t(description)}
          role="button"
        >
          {t(ctaText)}
        </Button>
      </div>
    </Product>
  )
}
