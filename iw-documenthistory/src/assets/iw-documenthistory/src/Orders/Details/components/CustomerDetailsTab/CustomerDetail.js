import React from 'react'
import PropTypes from 'prop-types'

export default function CustomerDetail({ label, value }) {
  return (
    <div className="row expanded customer-detail" key={label}>
      <div className="columns">
        <span className="customer-detail__label">{label}</span>
      </div>
      <div className="columns">
        <span className="customer-detail__value">{value}</span>
      </div>
    </div>
  )
}

CustomerDetail.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.node,
}

CustomerDetail.defaultProps = {
  value: '',
}
