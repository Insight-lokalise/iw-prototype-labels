import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Panel } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'

import Contract from './Contract'

export default function Cart({
  contracts,
  fixedQuantity,
  productDetails,
  total,
  unitPrice
}) {
  const columnCount = 0 + (
    productDetails ? 3 : 0
  ) + (
    fixedQuantity ? 1 : 0
  ) + (
    unitPrice ? 1 : 0
  )
  return (
    <Panel className="c-cart">
      <Panel.Title>
        <h2 className="c-cart__title">
          {t('Your cart')}
          { !!total && (
            <Fragment>
              <span className="u-hide-visually">{`${t('contains')}`}</span>
              <span className="c-cart__items">{`${total} ${t('items')}`}</span>
            </Fragment>
          )}
        </h2>
      </Panel.Title>
      <div className="o-grid  c-cart__header">
        {productDetails && <div className={`o-grid__item  u-1/1  u-3/${columnCount}@tablet  c-cart__cell  c-cart__cell--header`}>{t('Item')}</div>}
        {unitPrice && <div className={`o-grid__item  u-1/2  u-1/${columnCount}@tablet  c-cart__cell  c-cart__cell--header  c-cart__cell--unit-price  u-show@tablet`}>{t('Unit price')}</div>}
        {fixedQuantity && <div className={`o-grid__item  u-1/2  u-1/${columnCount}@tablet  c-cart__cell  c-cart__cell--header  c-cart__cell--qty  u-show@tablet`}>{t('Qty')}</div>}
      </div>
      <div className="c-cart__body">
        { contracts.map(contract => (
          <Contract
            columnCount={columnCount}
            fixedQuantity={fixedQuantity}
            key={contract.name}
            lineItems={contract.lineitems}
            name={contract.name}
            productDetails={productDetails}
            showBand={contract.showBand}
            unitPrice={unitPrice}
          />
        ))}
      </div>
    </Panel>
  )
}

Cart.propTypes = {
  contracts: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    showBand: PropTypes.bool.isRequired,
    lineitems: PropTypes.array.isRequired,
  })).isRequired,
  fixedQuantity: PropTypes.objectOf(PropTypes.oneOfType([ PropTypes.bool, PropTypes.string ])),
  productDetails: PropTypes.objectOf(PropTypes.oneOfType([ PropTypes.bool, PropTypes.string ])),
  total: PropTypes.number,
  unitPrice: PropTypes.objectOf(PropTypes.oneOfType([ PropTypes.bool, PropTypes.string ])),
}

// TODO: Implement actual total when available from back-end
Cart.defaultProps = {
  fixedQuantity: undefined,
  productDetails: undefined,
  total: undefined,
  unitPrice: undefined,
}
