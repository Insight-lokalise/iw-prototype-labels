import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { Icon } from '@insight/toolkit-react'

export default function FieldError({ children, className, showIcon, ...rest }) {
    const classes = cn('c-form__error', className)
    return (
        <small aria-live="poilte" className={classes} {...rest}>
            {children}
            {showIcon && <Icon className="c-form__error-icon" icon="alert" type="arrow" />}
        </small>
    )
}

FieldError.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    showIcon: PropTypes.bool
}