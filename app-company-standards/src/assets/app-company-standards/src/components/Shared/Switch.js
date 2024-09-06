import React from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils'
import cn from 'classnames'

export default function Switch({
    checked,
    className,
    compressed,
    disabled,
    id,
    label,
    name,
    onChange,
    ...rest
}) {
    const classes = cn(
      "c-switch u-margin-bot",
      {
        "is-compressed": compressed
      },
      className
    );

    return (
        <div className={classes}>
            <input
                checked={checked}
                className="c-switch__input"
                disabled={disabled}
                id={id}
                name={name}
                onChange={onChange}
                type="checkbox"
                {...rest}
            />
            <span className="c-switch__body">
                <span className="c-switch__thumb" />
                <span className="c-switch__track" />
            </span>
            {label && (
                <label className="c-switch__label u-margin-left-tiny" htmlFor={id}>
                    {t(label)}
                </label>
            )}
        </div>
    )
}

Switch.propTypes = {
    checked: PropTypes.bool,
    className: PropTypes.string,
    compressed: PropTypes.bool,
    disabled: PropTypes.bool,
    id: PropTypes.string.isRequired,
    label: PropTypes.node,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func
}

Switch.defaultProps = {
    checked: false,
    className: '',
    compressed: false,
    disabled: false,
    label: null,
    onChange: () => {}
}

