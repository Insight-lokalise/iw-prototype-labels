import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

export default function Checkbox({
    checkboxLabel,
    className,
    value,
    ...rest
}) {
    const containerClasses = cn('c-checkbox__container', className)
    const optionLabel = checkboxLabel && (
        <label className="c-form__label c-form__label--checkbox">
            {checkboxLabel}
        </label>
    )

    return (
        <div className={containerClasses}>
            <input
                checked={!!value}
                className="c-checkbox"
                type="checkbox"
                {...rest}
            />
            {optionLabel}
        </div>
    )
}

Checkbox.propTypes = {
    checkboxLabel: PropTypes.node,
    className: PropTypes.string,
    value: PropTypes.bool
}