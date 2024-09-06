import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

export default function Select({
    className,
    containerClassName,
    fullWidth,
    hasNoInitialSelection = true,
    options = [],
    placeholder = 'Please Select',
    value,
    ...rest
}) {
    const containerClasses = cn('c-select-container', {
        'c-select-container--block': fullWidth
    }, containerClassName)
    const classes = cn('c-select', className)

    let hasNoTrackedSelection = hasNoInitialSelection
    const renderedOptions = options.map((option, index) => {
        const isStringOption = typeof option === 'string'
        const optionValue = isStringOption ? option : (option.optionValue || option.text)
        if (value && value === optionValue) hasNoTrackedSelection = false
        return (
            <option key={optionValue} value={optionValue}>
                {isStringOption ? option : option.text}
            </option>
        )
    })

    const emptyOptionNode = hasNoTrackedSelection && (
        <option selected value="" disabled>{placeholder}</option>
    )

    return (
        <div className={containerClasses}>
            <select className={classes} value={value} {...rest}>
                {emptyOptionNode}
                {renderedOptions}
            </select>
        </div>
    )
}

Select.propTypes = {
    className: PropTypes.string,
    containerClassName: PropTypes.string,
    fullWidth: PropTypes.bool,
    hasNoInitialSelection: PropTypes.bool,
    options: PropTypes.arrayOf([PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
            optionValue: PropTypes.string,
            text: PropTypes.string
        })
    ])]),
    placeholder: PropTypes.string,
    value: PropTypes.string
}
