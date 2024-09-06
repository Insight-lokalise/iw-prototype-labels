import React from 'react'
import PropTypes from 'prop-types'
import { Currency, Image } from "@insight/toolkit-react";
import { t } from "@insight/toolkit-utils";

import Stock from "@insight/toolkit-react/lib/SmartCart/Contents/Stock";
import PartNumbers from '../toolkit/PartNumbers'

export default function Details({
  callForAvailability,
  callForPrice,
  coi,
  coiStock,
  contractName,
  csi,
  csiStock,
  discount,
  imageUrl,
  listPrice,
  manufacturerId,
  manufacturerImage,
  manufacturerName,
  materialId,
  name,
  productUrl,
  regular,
  reserved,
  reservedStock,
  unitPrice,
  unspsc,
}) {
  const priceLabel = contractName && t('Contract price:')
    || coi && t('Client owned inventory price:')
    || t('Your price:')
  return (

    <div className='o-grid c-product'>
      <div className="o-grid__item u-1/4">
        <Image alt={name} className="c-product__details-image" image={imageUrl} />
      </div>
      <div className="o-grid__item c-product__body">
        <div className='c-pdp__details-container'>
          <h3 className='c-product__title u-text-bold u-font-size-large u-margin-bot--small'>{name}</h3>
          <PartNumbers inline={true} insightPart={materialId} mfrPart={manufacturerId} unspsc={unspsc} />
          <div className='o-grid o-grid--justify-between c-pdp__pricing-container'>
            <div className='o-grid__item o-grid__item--shrink'>
              <div className='o-grid'>
                {!!contractName && (
                  <div className='o-grid__item u-1/1 c-cs__pdp-contract'>
                    <h6>
                      {`${t('Contract')}: `}
                      <strong>{contractName}</strong>
                    </h6>
                  </div>
                )}

                {!!listPrice && (
                  <div className='o-grid__item u-1/1 u-flex-column u-margin-top-small'>
                    <span>{t(contractName ? 'Insight standard price' : 'List price')}</span>
                    <Currency className='u-text-strikethrough u-margin-bot--small' value={listPrice} />
                  </div>
                )}
                <div className='o-grid__item u-1/1 u-margin-top-small u-flex-column'>
                  <span className='u-margin-bot--small'>{t(priceLabel)}</span>
                  <Currency className='c-pdp__customer-price' value={unitPrice} />
                </div>
                {discount && (
                  <div className='o-grid__item u-1/1 c-cs__pdp-discount'>
                    <p>
                      {`${t('Discount')} %: `}
                      <strong>{discount}%</strong>
                    </p>
                  </div>
                )}
                {[
                  <Stock key='stock' stock={regular} description={t('Insight Stock')} />,
                  reserved ? <Stock key='reserved' stock={reservedStock} description={t('Reserved')} /> : null,
                  coi ? <Stock key='cso' stock={coiStock} description={t('Client Owned')} /> : null,
                  csi ? <Stock key='csi' stock={csiStock} description={t('Client Supplied')} />: null,
                ]}
              </div>
            </div>
            <div className='o-grid__item o-grid__item--shrink o-media__image'>
              <Image image={manufacturerImage} alt={manufacturerName} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Details.propTypes = {
  callForAvailability: PropTypes.bool,
  callForPrice: PropTypes.bool,
  coi: PropTypes.bool,
  coiStock: PropTypes.number,
  contractName: PropTypes.string,
  csi: PropTypes.bool,
  csiStock: PropTypes.number,
  discount: PropTypes.number,
  imageUrl: PropTypes.string.isRequired,
  listPrice: PropTypes.number,
  manufacturerId: PropTypes.string.isRequired,
  manufacturerImage: PropTypes.string.isRequired,
  materialId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  productUrl: PropTypes.string,
  regular: PropTypes.number,
  reserved: PropTypes.bool,
  reservedStock: PropTypes.number,
  unitPrice: PropTypes.number.isRequired,
  unspsc: PropTypes.string,
}

Details.defaultProps = {
  callForAvailability: false,
  callForPrice: false,
  coi: false,
  coiStock: 0,
  contractName: null,
  csi: false,
  csiStock: 0,
  discount: null,
  listPrice: null,
  productUrl: null,
  regular: 0,
  reserved: null,
  reservedStock: 0,
  unspsc: null,
}
