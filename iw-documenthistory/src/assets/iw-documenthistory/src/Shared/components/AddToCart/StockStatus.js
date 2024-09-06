import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { t } from '@insight/toolkit-utils/lib/labels'

export default function StockStatus({ stock }) {
  const stockText = ` ${t('Stock')}:`
  const isInStock = stock > 0
  const iconClass = cn('stock-status', {
    'ion-checkmark-circled stock-status--in-stock': isInStock,
    'ion-minus-circled stock-status--out-of-stock': !isInStock,
  })

  return (
    <span className={iconClass}>
      <span className="stock-status__text">{stockText + stock}</span>
    </span>
  )
}

StockStatus.propTypes = {
  stock: PropTypes.number.isRequired,
}
