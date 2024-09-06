import React from 'react'
import PropTypes from 'prop-types'
import Currency from '@insight/toolkit-react/lib/Currency/Currency'
import cn from 'classnames'
import { t } from '@insight/toolkit-utils/lib/labels'

import AddToCart from '../../../../Shared/components/AddToCart/AddToCart'
export default function BundleHeader({ bundleItem, currencyCode, isLoggedIn, getDEPInfo }) {
  /**
   * We only get the first item of a bundle because all items have the same information.
   * We only need one item to populate the bundle's header.
   */
  const {
    availableStock,
    bundle,
    contractId,
    isContractActive,
    qtyShipped,
    materialInfo: { materialId, nonShipabble },
  } = bundleItem.data[0]
  const canAddToCart = bundleItem.data.every(item => item.addToCart)
  const bundleTotalPrice = bundleItem.data.reduce((totals, item) => totals + item.totalPrice, 0)
  const addToCartItem = {
    ...bundleItem,
    contractId,
    isContractActive,
    materialId,
    bundleType: bundle.configType,
    name: bundle.name,
    nonShippable: nonShipabble,
    stock: availableStock,
  }

  return (
    <div className="bundle-header" id="bundle">
      <div className="row collapse expanded">
        <div className="columns small-12 large-4 print-6">
          <h2 className="bundle-header__part">
            {t('Mfr part #')}: {bundle.name}
          </h2>
        </div>
        <div className="columns small-12 large-4">
          <div className="row align-middle collapse item-body__row">
            <div className="columns small-6 large-12">
              <span className="item-body__label">{nonShipabble ? t('Qty') : t('Qty shipped')}</span>
            </div>
            <div className="columns small-6 large-12">
              <span className="item-body__value">
                {nonShipabble ? `${bundle.quantity}` : `${qtyShipped} ${t('of')} ${bundle.quantity}`}
              </span>
            </div>
          </div>
        </div>
        <div className={cn('columns small-12', { 'large-4 print-2': !isLoggedIn, 'large-1 print-2': isLoggedIn })}>
          <div className="row align-middle collapse item-body__row">
            <div className="columns small-6 large-12">
              <span className="item-body__label">{t('Total price')}</span>
            </div>
            <div className="columns small-6 large-12">
              <Currency className="item-body__value" value={bundleTotalPrice} currencyCode={currencyCode} />
            </div>
          </div>
        </div>
        {isLoggedIn && (
          <div className="columns small-12 large-3 hide-for-print">
            <AddToCart
              canAddToCart={canAddToCart}
              isBundle={bundleItem.type === 'bundle'}
              item={addToCartItem}
              getDEPInfo={getDEPInfo}
            />
          </div>
        )}
      </div>
    </div>
  )
}

BundleHeader.propTypes = {
  bundleItem: PropTypes.shape({
    data: PropTypes.arrayOf({
      addToCart: PropTypes.bool.isRequired,
      availableStock: PropTypes.number,
      cartItemMetaData: PropTypes.shape({
        countryOfUsage: PropTypes.string,
        smartTracker: PropTypes.arrayOf(PropTypes.object),
        contractReportingField: PropTypes.arrayOf(
          PropTypes.shape({
            name: PropTypes.string,
            value: PropTypes.string,
          })
        ),
      }),
      contractId: PropTypes.string,
      contractTextLineItem: PropTypes.arrayOf(PropTypes.string),
      ewrFee: PropTypes.number,
      isContractActive: PropTypes.bool,
      lineItemInvoiceInfo: PropTypes.arrayOf(PropTypes.string),
      materialInfo: PropTypes.shape({
        description: PropTypes.string,
        manufacturerName: PropTypes.string,
        manufacturerPartNumber: PropTypes.string,
        materialId: PropTypes.string,
        nonShipabble: PropTypes.bool,
        taaCompliant: PropTypes.bool,
        unitPrice: PropTypes.number,
      }),
      programId: PropTypes.string,
      shippingStatus: PropTypes.string,
      totalPrice: PropTypes.number,
    }),
    id: PropTypes.number,
    status: PropTypes.string,
    type: PropTypes.string,
  }).isRequired,
  currencyCode: PropTypes.string.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  getDEPInfo: PropTypes.func.isRequired,
}
