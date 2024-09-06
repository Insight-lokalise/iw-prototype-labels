import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

export default function TextArea({ className, ...rest }) {
    const classes = cn('c-textarea', className)
    return (
        <textarea className={classes} {...rest} />
    )
}

TextArea.propTypes = {
    className: PropTypes.string
}