import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils'

import Stock from './Stock'

export default function FixedQuantity({ discontinued, coi, coiStock, csi, csiStock, quantity, regular, reserved, reservedStock, shippable }) {
  return (
    <div className="o-grid__item  u-3/5  u-1/5@tablet  c-cart__cell  c-cart__cell--data-label  c-cart__cell--qty" data-label="Qty">
      { (!discontinued) ? (
        <Fragment>
          <span className="c-cart__qty">{quantity}</span>
          <div className="c-cart-stock-info__container">
            { shippable ? ([
              <Stock key='stock' stock={regular} description='Insight Stock' />,
              reserved && <Stock key='reserved' stock={reservedStock} description='Reserved' />,
              coi && <Stock key='cso' stock={coiStock} description='Client Owned' />,
              csi && <Stock key='csi' stock={csiStock} description='Client Supplied' />,
            ]) : (
              <span key='no-ship'>{t('Non-shippable')}</span>
            )}
          </div>
        </Fragment>
      ) : (
        <span>{t('Not available')}</span>
      )}
    </div>
  )
}

FixedQuantity.propTypes = {
  discontinued: PropTypes.bool,
  coi: PropTypes.bool,
  coiStock: PropTypes.number,
  csi: PropTypes.bool,
  csiStock: PropTypes.number,
  quantity: PropTypes.number.isRequired,
  regular: PropTypes.number.isRequired,
  reserved: PropTypes.bool,
  reservedStock: PropTypes.number,
  shippable: PropTypes.bool,
}

FixedQuantity.defaultProps = {
  discontinued: false,
  coi: false,
  coiStock: 0,
  csi: false,
  csiStock: 0,
  reserved: false,
  reservedStock: 0,
  shippable: true,
}
