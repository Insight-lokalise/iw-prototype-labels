import React from 'react'
import PropTypes from 'prop-types'
import parse from 'react-html-parser'

export default function EngagePlacement({ className, markup }) {
  // just disabling script on ssafer side, will run this by marketing
  const options = {
    transform: (node) => (node.type === 'script') ? null : undefined
  }
  return (
    <div className={className}>
      {parse(markup, options)}
    </div>
  )
}

EngagePlacement.propTypes = {
  className: PropTypes.string,
  markup: PropTypes.string.isRequired,
}

EngagePlacement.defaultProps = {
  className: '',
}
