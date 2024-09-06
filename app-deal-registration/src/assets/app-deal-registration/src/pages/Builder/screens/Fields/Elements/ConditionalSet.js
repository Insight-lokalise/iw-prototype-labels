import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { Field } from '@components'
import { useBuilderField } from '../../../context'
import { validateWhen } from '../../../helpers'

export default function ConditionalSet({ is, prefix, when }) {
    const { fieldName, isFieldConditional } = useBuilderField()
    const [conditionalIs, setConditionalIs] = useState(is)
    const [conditionalWhen, setConditionalWhen] = useState(when)

    const handleChange = ({ target: { name, value }}) => {
        const splitName = name.split('.')
        const targetName = splitName[splitName.length - 1]
        const handler = targetName === 'is' ? setConditionalIs : setConditionalWhen
        handler(prev => value)
    }

    if (!isFieldConditional) {
        return null
    }

    return (
        <div className="o-grid o-grid--gutters-small">
            <Field
                className="o-grid__item"
                handleChange={handleChange}
                initialValue={conditionalIs}
                label="Is"
                name={`${prefix}.is`}
                type="Text"
            />
            <Field
                className="o-grid__item"
                handleChange={handleChange}
                initialValue={conditionalWhen}
                label="When"
                name={`${prefix}.when`}
                type="Text"
                validators={[validateWhen(fieldName)]}
            />  
        </div>
    )
}

ConditionalSet.propTypes = {
    is: PropTypes.string,
    prefix: PropTypes.string.isRequired,
    when: PropTypes.string
}