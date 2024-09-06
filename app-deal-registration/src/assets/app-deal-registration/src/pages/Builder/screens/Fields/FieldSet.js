import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@insight/toolkit-react'

import { useBuilderContext } from '../../context'
import { Basic, ConditionalSet, Optional } from './Elements'

export default function FieldSet({ 
    inputId,  
    removeSetEnabled, 
    set, 
    setIndex
}) {
    const prefix = `sets.${setIndex}`
    const { conditionalGroups, is = '', type, validators, when = '' } = set
    const { dispatcher } = useBuilderContext()

    const [fieldType, setFieldType] = useState(type)
    const removeSet = () => {
        dispatcher.removeSet({ inputId, setId: set.id })
    }
    return (
        <div className="c-builder-field__set">
            {removeSetEnabled && (
                <Button className="c-builder-field__set-remove" color="link" icon="trashcan" onClick={removeSet} />
            )}
            <ConditionalSet is={is} prefix={prefix} when={when} />
            <Basic prefix={prefix} setFieldType={setFieldType} type={fieldType} />
            <Optional conditionalGroups={conditionalGroups} prefix={prefix} type={fieldType} validators={validators} />
        </div>
    )
}

FieldSet.propTypes = {
    fieldName: PropTypes.string.isRequired,
    inputId: PropTypes.string.isRequired,
    isFieldConditional: PropTypes.bool.isRequired,
    removeSetEnabled: PropTypes.bool.isRequired,
    set: PropTypes.shape({}),
    setIndex: PropTypes.number
}