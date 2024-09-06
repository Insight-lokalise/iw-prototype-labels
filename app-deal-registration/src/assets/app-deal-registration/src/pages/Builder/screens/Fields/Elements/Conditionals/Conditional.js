import React from 'react'
import PropTypes from 'prop-types'

import { Field } from '@components'
import { useBuilderField } from '@pages/Builder/context'
import { validateWhen } from '@pages/Builder/helpers'

export default function Conditional({ conditionalIndex, groupIndex, is, prefix, updateConditionals, when }) {
    const { fieldName } = useBuilderField()
    const handleChange = ({ target: { name, value }}) => {
        updateConditionals({ action: 'update-conditional', conditionalIndex, groupIndex, name, value })
    }

    return (
        <div className="c-builder-field__conditional o-grid o-grid--gutters-small">
            <Field
                className="o-grid__item"
                handleChange={handleChange}
                initialValue={when}
                label="When"
                name={`${prefix}.when`}
                type="Text"
                validators={[validateWhen(fieldName)]}
            />
            <Field
                className="o-grid__item"
                handleChange={handleChange}
                initialValue={is}
                label="Is"
                name={`${prefix}.is`}
                type="Text"
            />
        </div>
    )
}

Conditional.propTypes = {
    prefix: PropTypes.string.isRequired
}