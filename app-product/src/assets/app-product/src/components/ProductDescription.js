import React from 'react'
import PropTypes from 'prop-types'

export default function ProductDescription({ title, subtitle }) {
  return (
    <h1 className="c-product-description u-margin-bot-small">
      {title}
      {subtitle &&
        <span className="c-product-description__subtitle">{' ' + subtitle}</span>
      }
    </h1>
  )
}

ProductDescription.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
}

ProductDescription.defaultProps = {
  subtitle: null,
}
