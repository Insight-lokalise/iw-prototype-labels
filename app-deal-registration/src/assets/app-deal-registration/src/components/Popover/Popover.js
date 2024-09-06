import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

export default function Popover({
    button,
    children,
    className,
    closeOnOutsideClick = true,
    contentClassName,
    isOpen,
    onClose,
    position = 'top-right',
    ...rest
}) {
    const containerRef = useRef(null)

    const onKeyDown = e => {
        if (e.key === 'Escape') {
            e.preventDefault()
            onClose(e)
        }
    }

    const onCloseClick = e => {
        e.preventDefault()
        onClose(e)
    }

    const onOutsideClick = e => {
        if (!containerRef.current.contains(e.target)) {
            e.preventDefault()
            onClose()
        }
    }

    useEffect(() => {
        if (closeOnOutsideClick) {
            window.addEventListener('click', onOutsideClick)
        }

        return () => {
            if (closeOnOutsideClick) {
                window.removeEventListener('click', onOutsideClick)
            }
        }
    }, [])

    const classes = cn('c-popover', `c-popover--${position}`, {
        'is-open': isOpen
    }, className)
    const contentClasses = cn('c-popover__content', `c-popover__content--${position}`, {
        'is-open': isOpen
    }, contentClassName)

    return (
        <div className={classes} ref={containerRef}>
            {button}
            {isOpen && (
                <div className={contentClasses}>
                    {children}
                </div>
            )} 
        </div>
    )  
}