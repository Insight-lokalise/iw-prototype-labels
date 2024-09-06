import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

import { renderField } from '@services/form'

export default function CustomInput({ field, passedContext, styles }) {
    return (
        <div className="c-deal__field-wrapper">
            {renderField(field, passedContext, styles)}
        </div>
    )
}