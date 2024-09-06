import React from 'react'
import PropTypes from 'prop-types'

export default function RTRow(props) {
  const { render, ...passedProps } = props
  return render(passedProps)
}

RTRow.propTypes = {
  render: PropTypes.func.isRequired,
}
