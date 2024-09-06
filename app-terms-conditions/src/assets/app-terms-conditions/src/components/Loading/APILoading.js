import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

import {Icon, Loading} from '@insight/toolkit-react'

export default function APILoading({
    className,
    children,
    data,
    error,
    loading
}) {
    const classes = cn('c-api-loading', {
        'has-error': error,
        'is-loading': loading
    }, className)

    const getPageContent = () => {
        if (loading) {
            return <Loading />
        }
        if (error) {
            return <div className='c-form__error'>
                        <Icon icon='alert' type='error' />
                        <span>{error}</span>
                    </div>
        }
        if (!data || (Array.isArray(data) && data.length === 0)) {
            return null
        }

        return children(data)
    }

    return <div className={classes}>{getPageContent()}</div>
}

APILoading.propTypes = {
    className: PropTypes.string,
    children: PropTypes.func.isRequired,
    data: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.shape({})
    ]),
    error: PropTypes.string,
    loading: PropTypes.bool
}