import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

export default function Text({
    className,
    narrow,
    ...rest
}) {
    const classes = cn('c-input', {
        'c-input--narow': narrow
    }, className)

    return <input className={classes} {...rest} />
}

Text.propTypes = {
    className: PropTypes.string,
    narrow: PropTypes.bool
}