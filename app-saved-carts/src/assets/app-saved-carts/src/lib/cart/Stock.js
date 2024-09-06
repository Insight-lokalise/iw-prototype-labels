import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from '@insight/toolkit-react'
import cn from 'classnames'
import { t } from '@insight/toolkit-utils'

export default function Stock({ className, description, stock }) {
  const iconProps = stock > 0 ? (
    { icon: 'checkmark-circled', type: 'success' }
  ) : (
    { icon: 'remove-circled', type: 'ghost' }
  )
  return (
    <span className={cn('c-cart-stock-info', className)}>
      <span className="c-cart-stock-info__desc">
        <Icon className="c-cart-stock-info__icon" {...iconProps} />
        {` ${t(description)}: `}
      </span>
      <span className="c-cart-stock-info__stock">
        {stock}
      </span>
    </span>
  )
}

Stock.propTypes = {
  className: PropTypes.string,
  description: PropTypes.string.isRequired,
  stock: PropTypes.number.isRequired,
}

Stock.defaultProps = {
  className: ''
}
