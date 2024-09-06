import cn from 'classnames'
import React from 'react'

/**
* A simple wrapper for a <button>!.
*
*  @param {Object} props Any normal property you would apply to a <button>.
*/
export function IWButton({ className, children, ...rest }) {
  return (
    <button className={cn('button', className)} {...rest}>
      {children}
    </button>
  )
}
