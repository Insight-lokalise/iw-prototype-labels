import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { Icon } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'

export default function DiscontinuedProductIcon({ product, className }) {
  const { discontinued } = product
  const classes = cn('', className)
  return (
    <div className={classes}>
      {discontinued && (
        <div title={t('This product has been discontinued')}>
          <Icon icon="alert" type="error" />
        </div>
      )}
    </div>
  )
}

DiscontinuedProductIcon.propTypes = {
  product: PropTypes.shape({
    discontinued: PropTypes.bool
  }),
  className: PropTypes.string
}

DiscontinuedProductIcon.defaultProps = {
  product: {},
  className: ''
}