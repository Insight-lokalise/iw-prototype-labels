import React from 'react'
import cn from 'classnames'

import { Field } from '@components'
import { transformStyles } from '../transforms'

export default function renderField(field, values, styles) {
    const { display, is, visible, when, ...fieldProps } = field
    const { type } = fieldProps

    if (!visible) {
        return null
    }

    const classes = cn('c-deal__field', {
        'is-date': type === 'Date',
        'is-listbox': type === 'ListBox'
    }, transformStyles(styles, 'field'))

    return (
        <div className={classes}>
            <Field {...fieldProps} />
        </div>
    )
}
