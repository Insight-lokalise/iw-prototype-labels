import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Currency, Image, Stock } from "@insight/toolkit-react";
import { t, getPriceSavingsInformation } from "@insight/toolkit-utils";

import Pricing from './Pricing'
import PartNumbers from '../toolkit/PartNumbers'

export default function Details({
  callForAvailability,
  callForPrice,
  coi,
  coiStock,
  isViewPriceEnabled,
  isViewAvailabilityEnabled,
  contract,
  csi,
  csiStock,
  imageUrl,
  manufacturerId,
  manufacturerImage,
  manufacturerName,
  materialId,
  name,
  productUrl,
  price,
  regular,
  reserved,
  reservedStock,
  shippable,
  unspsc,
  proratable,
  explodable,
  isEMEA,
  vatInclusivePrice,
}) {
  const { abbreviation, contractDiscount, displayDiscount, webPrice, listPrice, indexPrice, listPriceInclVat, webPriceInclVat } = price || {};
  const { name: contractName, showBand } = contract
  const priceLabel = showBand && 'Contract price:' || coi && 'Client owned inventory price:' || csi && 'Client supplied inventory price:' || !showBand && 'Your price:'
  const showDiscount = displayDiscount || false
  const priceInclVat = webPriceInclVat || listPriceInclVat
  const nListPrice = indexPrice? Number(indexPrice): listPrice ? Number(listPrice) : 0
  const nInsightPrice = webPrice ? Number(webPrice) : 0
  const nIndexPrice = indexPrice? Number(indexPrice): 0
  if (!nListPrice || !nInsightPrice) return null
  const { priceSavings, showListPriceAndSavings, priceSavingsInPercentage } = getPriceSavingsInformation(nListPrice, nInsightPrice, showDiscount);

  return (
    <div className="o-grid c-product">
      <div className="o-grid__item u-1/4">
        <Image
          alt={name}
          className="c-product__details-image"
          image={imageUrl}
        />
      </div>
      <div className="o-grid__item c-product__body">
        <div className="c-pdp__details-container">
          <h3 className="c-product__title u-h5 u-text-bold u-margin-bot-small">
            {name}
          </h3>
          <PartNumbers
            inline
            insightPart={materialId}
            mfrPart={manufacturerId}
            unspsc={unspsc}
          />
          <div className="o-grid o-grid--justify-between c-pdp__pricing-container">
            <div className="o-grid__item u-3/5">
              {!!contract && showBand && (
                <div className="o-grid">
                  <div className="o-grid__item u-1/1 c-cs__pdp-contract u-margin-top-tiny">
                    <p className="u-truncate u-margin-bot-none u-font-size-tiny">
                      {` ${t("Contract")}: `}
                      <span className="u-text-bold">{t(contractName)}</span>
                    </p>
                  </div>
                </div>
              )}
              {callForPrice ? (
                <div className="o-grid">
                  <div className="o-grid__item u-margin-top-tiny">
                    <p className="u-margin-bot-none u-font-size-tiny">
                      {t("Call for price")}
                    </p>
                  </div>
                </div>
              ) : (
                isViewPriceEnabled &&
                <Fragment>
                  <div className="o-grid">
                    <div className="o-grid__item u-1/1">
                      <div className="o-grid__item o-grid__item--shrink u-margin-top-tiny u-font-size-tiny">
                        <span className="u-margin-bot-small">
                          {t(priceLabel)}
                        </span>
                      </div>
                      <div className="o-grid__item o-grid__item--shrink u-margin-top-tiny">
                        <Currency
                          className="c-pdp__customer-price u-text-bold"
                          value={webPrice}
                          showVAT={isEMEA}
                          tax={false}
                          highlight={true}
                        />
                      </div>
                      {isEMEA &&
                        <div className="o-grid__item o-grid__item--shrink u-margin-top-tiny">
                          <Currency
                            className="c-pdp__customer-price u-text-bold"
                            value={priceInclVat}
                            showVAT={isEMEA}
                            tax={true}         
                          />
                        </div>
                      }
                    </div>
                    {showListPriceAndSavings && (
                      <Pricing
                        listPrice={nListPrice}
                        indexPrice={nIndexPrice}
                        showVAT={isEMEA}
                        strike={true}
                      />
                    )}
                  </div>
                </Fragment>
              )}
              {showDiscount && priceSavings > 0 && (
                <div className="o-grid u-margin-top-tiny">
                  <div className="o-grid__item c-cs__pdp-discount">
                    {t('Save')}{' '}
                    <Currency value={priceSavings} />
                    {(` (${t('Discount:')} ${priceSavingsInPercentage}%)`)}
                  </div>
                </div>
              )}
              {isViewAvailabilityEnabled&&(<div className="o-grid u-margin-top-tiny u-margin-bot-tiny">
                {[
                  callForAvailability ? (
                    <span className="o-grid__item o-grid__item--shrink u-margin-right-tiny">
                      <Stock
                        className="u-font-size-tiny"
                        key="availability"
                        description="Call for availability"
                        type="call"
                        isInModal
                      />
                    </span>
                  ) : null,
                  !shippable || explodable ? (
                    <span className="o-grid__item o-grid__item--shrink u-margin-right-tiny">
                      <Stock
                        className="u-font-size-tiny"
                        key="unlimited"
                        description={t("Unlimited availability")}
                        type="unlimited"
                        isInModal
                      />
                    </span>
                  ) : null,
                  regular > 0 ? (
                    <span className="o-grid__item o-grid__item--shrink u-margin-right-tiny">
                      <Stock
                        className="u-font-size-tiny"
                        key="stock"
                        stock={regular}
                        description={t("Stock")}
                      />
                    </span>
                  ) : null,
                  reservedStock > 0 ? (
                    <span className="o-grid__item o-grid__item--shrink u-margin-right-tiny">
                      <Stock
                        className="u-font-size-tiny"
                        key="reserved"
                        stock={reservedStock}
                        description="Reserved"
                      />
                    </span>
                  ) : null,
                  coiStock > 0 ? (
                    <span className="o-grid__item o-grid__item--shrink u-margin-right-tiny">
                      <Stock
                        className="u-font-size-tiny"
                        key="cso"
                        stock={coiStock}
                        description="Client Owned"
                      />
                    </span>
                  ) : null,
                  csiStock > 0 ? (
                    <span className="o-grid__item o-grid__item--shrink u-margin-right-tiny">
                      <Stock
                        className="u-font-size-tiny"
                        key="csi"
                        stock={csiStock}
                        description="Client Supplied"
                      />
                    </span>
                  ) : null
                ]}
              </div>)
              }
              {proratable && (
                <div className="c-prorated-product">
                  <span>
                    {t(
                      "The price displayed will be prorated in the cart based on the remaining agreement period."
                    )}
                  </span>
                </div>
              )}
            </div>
            <div className="o-grid__item u-2/5">
              <div className="o-grid o-grid--justify-center">
                <Image
                  imageClassName="c-cs-client-pdp__product-logo"
                  className="o-grid__item o-grid__item--shrink u-margin-top-tiny"
                  image={manufacturerImage}
                  alt={manufacturerName}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Details.propTypes = {
  callForAvailability: PropTypes.bool,
  callForPrice: PropTypes.bool,
  coi: PropTypes.bool,
  coiStock: PropTypes.number,
  contract: PropTypes.shape({}),
  csi: PropTypes.bool,
  csiStock: PropTypes.number,
  discountAmount: PropTypes.number,
  imageUrl: PropTypes.string.isRequired,
  isViewPriceEnabled:PropTypes.bool,
  isViewAvailabilityEnabled:PropTypes.bool,
  listPrice: PropTypes.number,
  manufacturerId: PropTypes.string.isRequired,
  manufacturerImage: PropTypes.string.isRequired,
  materialId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  productUrl: PropTypes.string,
  regular: PropTypes.number,
  reserved: PropTypes.bool,
  reservedStock: PropTypes.number,
  shippable: PropTypes.bool,
  unitPrice: PropTypes.number.isRequired,
  vatInclusivePrice: PropTypes.number,
  unspsc: PropTypes.string,
  proratable: PropTypes.bool,
  explodable: PropTypes.bool,
}

Details.defaultProps = {
  callForAvailability: false,
  callForPrice: false,
  coi: false,
  coiStock: 0,
  contract: {},
  csi: false,
  csiStock: 0,
  discountAmount: null,
  listPrice: null,
  productUrl: null,
  regular: 0,
  reserved: null,
  reservedStock: 0,
  isViewPriceEnabled:true,
  isViewAvailabilityEnabled:true,
  shippable: true,
  unspsc: null,
  proratable: false,
  explodable: false,
  vatInclusivePrice: null,
}
