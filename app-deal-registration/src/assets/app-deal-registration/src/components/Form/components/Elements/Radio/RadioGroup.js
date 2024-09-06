import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import Radio from './Radio'

export default function RadioGroup({
    disabled,
    name,
    onBlur,
    onChange,
    options,
    value,
}) {
    return (
        <Fragment>
            {options.map((option, idx) => {
                const { optionDisabled, id, value: optionValue, ...rest } = option
                return (
                    <Radio
                        checked={value === optionValue}
                        disabled={disabled || optionDisabled}
                        id={id}
                        key={id}
                        name={name}
                        onBlur={onBlur}
                        onChange={onChange}
                        value={optionValue}
                        {...rest}
                    />
                )
            })}
        </Fragment>
    )
}