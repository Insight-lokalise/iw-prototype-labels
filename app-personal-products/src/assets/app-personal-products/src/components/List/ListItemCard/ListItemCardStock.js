import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'

export default function ListItemCardStock({ stock }) {
  const stockText = ` ${t('Stock')}:`
  const isInStock = stock > 0
  { /* TODO: Will replace with Icon component */ }
  const icon = isInStock
    ? <Icon icon="remove-circled" />
    : <Icon icon="remove-circled" />

  return (
    <div className="c-item-card__stock">
      {icon}
      <span>{stockText}{stock}</span>
    </div>
  )
}

ListItemCardStock.propTypes = {
  stock: PropTypes.number.isRequired,
}
