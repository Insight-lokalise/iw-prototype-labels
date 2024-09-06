import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

export default function Overview({ description, overview }) {
  return (
    <Fragment>
      <p className='u-font-size-small u-margin-top'>{description}</p>
      <p className='u-font-size-small'>{overview}</p>
    </Fragment>
  )
}

Overview.propTypes = {
  description: PropTypes.string,
  overview: PropTypes.string,
}

Overview.defaultProps = {
  description: null,
  overview: null,
}