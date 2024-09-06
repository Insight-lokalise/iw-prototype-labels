import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

export default function Radio({
    checked,
    className,
    disabled,
    id,
    label,
    name,
    value,
    ...rest    
}) {
    const classes = cn('c-radio', className)
    const optionalLabel = label && (
        <label className="c-form__label c-form__label--radio" htmlFor={id}>
            {label}
        </label>
    )

    return (
        <div className="c-radio__container">
            <input
                defaultChecked={checked}
                className={classes}
                disabled={disabled}
                id={id}
                name={name}
                type="radio"
                value={value}
                {...rest}
            />
            {optionalLabel}
        </div>
    )
}