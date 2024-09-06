import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

/**
 * A component that can be used to show or hide with css based on a boolean
 * note: children will still render so don't use to avoid rendering
 *  this component should only be used when you want a component to render but not be visible
 */
export function IWShowHide({ children, showIf }) {
  return <div className={cn({ hide: !showIf })}>{children}</div>
}

IWShowHide.propTypes = {
  showIf: PropTypes.bool.isRequired,
}
