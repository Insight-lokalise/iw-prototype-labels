import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

export default function SpeedDialActions({
    children,
    className,
    delay,
    isOpen,
    onClick,
    title,
    ...rest
}) {
    let clickProp = { onClick }
    if (typeof document !== 'undefined' && 'ontouchstart' in document.documentElement) {
        let startTime
        clickProp = {
            onTouchStart: () => {
                startTime = new Date()
            },
            onTouchEnd: () => {
                if (new Date() - startTime < 500) {
                    onClick()
                }
            }
        }
    }
    const classes = cn('c-button c-button--primary c-speed-dial-action', {
        'is-closed': !isOpen
    }, className)

    return <button className={classes} role="menuitem" title={title} {...clickProp}>{children}</button>
}