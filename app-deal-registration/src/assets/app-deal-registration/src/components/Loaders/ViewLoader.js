import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { Loading } from '@insight/toolkit-react'

export default function ViewLoader({ className, size = 'large', ...rest }) {
    const classes = cn('c-view-loader', className)
    return (
        <div className={classes}>
            <Loading size={size} {...rest} />
        </div>
    )
}

ViewLoader.propTypes = {
    className: PropTypes.string,
    size: PropTypes.string
}