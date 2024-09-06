import React from 'react'
import PropTypes from 'prop-types'

import cn from 'classnames'

export default function FadeIn({ children, className, delay }) {
  const animationDelay = `${0.1 + delay * 0.075}s`
  const classes = cn('u-fade-in', className)

  return (
    <div className={classes} style={{ animationDelay }}>
      {children}
    </div>
  )
}

FadeIn.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  delay: PropTypes.number.isRequired,
}

FadeIn.defaultProps = {
  className: '',
}
