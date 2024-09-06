import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

export default function SummaryRow({ className, title, priceElement }) {
  return (
    <div className={cn('row is-collapse-child', className)}>
      <div className="columns iw-summary__label">{title}</div>
      <div className="columns shrink iw-summary__value">{priceElement}</div>
    </div>
  )
}

SummaryRow.propTypes = {
  className: PropTypes.string,
  priceElement: PropTypes.node.isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
}

SummaryRow.defaultProps = {
  className: '',
}
