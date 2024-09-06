import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import {
  Button,
  connectToLocale,
  Currency,
  Icon,
  SimpleStockInfo,
  ListPrice,
} from '@insight/toolkit-react'
import { t, getVatPriceProps } from '@insight/toolkit-utils'
import { PDPContext } from '../../context'
import { Image } from '../../shared/Image/Image'
import InstantRebates from './InstantRebates'
import { getWebPricingFeatureFlag } from '../../shared'
import { ProrationMessage } from './ProrationMessage'
import useResponsive from '../../hooks/useResponsive'
import SpecificationsIPSContract from './SpecificationsIPSContracts'

function SpecificationsPricing({ availableQuantity, unlimited, selectedContract, setSelectedContract, contracts, context, isOpenMarketEnabled }) {
  const { locale, permissions, isIPSUser } = context
  const {enableViewPricing} = permissions
  const { isLoggedIn, product, showVAT } = useContext(PDPContext)
  const { price, proratable, availability } = product
  const { coi, csi, cri } = availability
  const { webPrice, insightPrice, listPrice, listPriceInclVat, currency, priceLabel, webPriceInclVat} = price
  const newWebPriceFeature = getWebPricingFeatureFlag();
  const isStockAndPriceDisabled = isLoggedIn ? Insight?.webGroupPermissions?.includes('disable_stock_and_price_display') : false
  // list price was disabled in login IPS no matter the permissions and discounts, unless “US Comm Web Index / Discount“ in SAP was enabled
  const isListPriceEnable = isIPSUser && isLoggedIn ? selectedContract?.displayDiscount : isLoggedIn && Insight?.webGroupPermissions?.includes('list_price');
  const enableInventorySearch = isLoggedIn && permissions?.enable_inventory_search
  const [isMobile] = useResponsive()

  const priceLabelMap = {
    "COIPRICELABEL": "Client owned price",
    "CSIPRICELABEL": "Client supplied price",
    "YOURPRICELABEL": "Your price"
  }
  const bestPriceBadge = <span className="c-product-specifications__pricing__your-price__best-price">Best price</span>
  const displaySelectedContract = selectedContract?.abbreviation || selectedContract?.contractName
  const isBestPrice = (product?.price?.contractNumber === selectedContract?.contractNumber) && isOpenMarketEnabled && contracts?.length > 1;
  // display list price for all logout user and login user with list_price permission and ips user
  const displayListPrice =
    !isLoggedIn || Insight?.webGroupPermissions?.includes('list_price') || isIPSUser
  const showDiscount = (isIPSUser && selectedContract?.displayDiscount) || false
  const contractDiscount = selectedContract?.contractDiscount || 0
  const getPrice = (ipsPrice, defaultPrice) => {
    return (isIPSUser && !!selectedContract) ? ipsPrice : defaultPrice
  }

  // Select manuafacturer image
  const manufacturerImage = product.manufacturer?.images?.length
    ? product.manufacturer?.images[0]
    : false

  const renderAvailability = () => {
    const isAvailable = product.availability?.totalQuantity ? true : false
    return (
      <p>
        Get it as soon as:{' '}
        <span className="availability-message">
          {isAvailable
            ? product.availabilityMessage
            : product.unavailabilityMessage}
        </span>
        {!isAvailable && '(estimated)'}
      </p>
    )
  }

  const renderPricingLabel = () => {
    return enableInventorySearch && !!priceLabel
      ? `${t(priceLabelMap[priceLabel])}:`
      : (newWebPriceFeature || isLoggedIn)
        ? `${t('Your price:')}` : `${t('List price:')}`;
  }

  // check for view pricing permission
  if(!enableViewPricing) {
    return null
  }

  // Check if call for price
  if (product.price?.callForPrice) {
    return (
      <section className="c-product-specifications__pricing__call-for-price u-text-bold">
        {t('Contact us for availability & pricing')}
      </section>
    )
  }
  const { exclVatProps, inclVatProps } = getVatPriceProps(showVAT);

  return !isStockAndPriceDisabled && (
    <section className={cn("c-product-specifications__pricing o-grid",
      { 'c-product-specifications__pricing__vat': showVAT }
    )}>
      <div className="pricing-left-col u-4/5@tablet">
        <div className="o-grid__item">
          {displaySelectedContract && isIPSUser && (
            <div className="c-product-specifications__pricing__selected-contract o-grid">
              <span className="u-text-bold">{displaySelectedContract}</span>
            </div>
          )}
          <div className="c-product-specifications__pricing__price o-grid">
            <div className="c-product-specifications__pricing__your-price o-grid__item u-1/1">
              <div>
                <span className="u-text-bold">
                  {renderPricingLabel()}
                </span>
                <Currency
                  currencyCode={currency}
                  value={getPrice(selectedContract?.webPrice, webPrice)}
                  size="large"
                  className='c-product-specifications__pricing__your-price__value'
                  {...exclVatProps}
                />
                {isBestPrice && bestPriceBadge}
                {showVAT &&
                  <div>
                      <span className='o-grid o-grid--justify-right'>
                        <Currency
                          value={webPriceInclVat}
                          currencyCode={currency}
                          size="large"
                          className="c-currency__price-value"
                          {...inclVatProps}
                        />
                      </span>
                  </div>
                }
              </div>
            </div>
          </div>
          {displayListPrice &&
            <div className="c-product-specifications__pricing__price o-grid__item u-1/1">
              <ListPrice
                currencyCode={currency}
                listPrice={listPrice}
                insightPrice={getPrice(selectedContract?.webPrice, webPrice)}
                showListPriceLabel
                strike
                showHorizontalSaveTag
                showSaving={newWebPriceFeature}
                valueClassName='c-product-specifications__listprice'
                labelClassName='u-text-bold'
                showDiscount={showDiscount}
                discount={contractDiscount}
                indexPrice={selectedContract?.indexPrice}
                {...exclVatProps}
              />
            </div>
          }
          {contracts?.length > 1 && selectedContract && isIPSUser && (
            <div className="c-product-specifications__pricing__ips-contracts o-grid__item u-1/1">
              <SpecificationsIPSContract
                prices={contracts}
                selectedContract={selectedContract}
                setSelectedContract={setSelectedContract}
                locale={locale}
                isMobile={isMobile}
              />
            </div>
          )}
          <div className="c-product-specifications__pricing__stock o-grid">
            <div>
              <div className="o-grid c-product-specifications__pricing__inventory">
                <SimpleStockInfo
                  stock={availableQuantity}
                  unlimited={unlimited}
                  showLimitedStockQty
                  showBackOrder={true}
                  isPDP={true}
                />
                {!!coi && <span>&nbsp;{`| ${t('Client owned')}: ${coi}`}</span>}
                {!!csi && <span>&nbsp;{`| ${t('Client supplied')}: ${csi}`}</span>}
                {!!cri && <span>&nbsp;{`| ${t("Reserved")}: ${cri}`}</span>}
              </div>
              {availableQuantity <= 0 ? (
                <div className="c-product-specifications__pricing__stock-message">
                  {t("This item will ship once it's back in stock.")}
                </div>
              ) : null}
            </div>
            {proratable && <ProrationMessage />}
          </div>

          {/* TODO:API waiting on availability message*/}
          {/* <div className="o-grid__item u-1/1">{renderAvailability()}</div> */}
        </div>
      </div>
      <div className="o-grid__item u-1/5@tablet">
        {manufacturerImage ? (
          <div className="c-product-specifications__pricing__brand-logo">
            <Button
              color="none"
              aria-label={t('Go to brand category page')}
              href={`/${locale}/search.html?qtype=all&q=${encodeURIComponent(
                product.manufacturer?.name?.toLowerCase()
              )}&qsrc=k`}
            >
              <Image
                src={manufacturerImage.url}
                alt={manufacturerImage.description}
              />
            </Button>
          </div>
        ) : null}
        {/* TODO:Phase 2 - Display promotional content */}

        {!isLoggedIn ? <InstantRebates /> : null}

        {product.promotion ? (
          <div className="c-product-specifications__pricing__promotion">
            <Icon
              icon="information-circled"
              className="c-product-specifications__pricing__ribbon"
              size={28}
            />
            <span>{product.promotion}</span>
          </div>
        ) : null}
      </div>
    </section>
  )
}

SpecificationsPricing.propTypes = {
  availableQuantity: PropTypes.number.isRequired,
}

export default connectToLocale(SpecificationsPricing)
