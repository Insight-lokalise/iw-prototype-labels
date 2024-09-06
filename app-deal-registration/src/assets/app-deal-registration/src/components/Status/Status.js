import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { Icon } from '@insight/toolkit-react'

export default function Status({ className, isActive, ...rest }) {
    const classes = cn('c-status', className)
    const icon = isActive
        ? { icon: 'checkmark', type: 'success' }
        : { icon: 'alert', type: 'error' }
    
    return (
        <div className={classes}>
            <Icon {...icon} />
            <span>{isActive ? 'Active' : 'Inactive'}</span>
        </div>
    )
}