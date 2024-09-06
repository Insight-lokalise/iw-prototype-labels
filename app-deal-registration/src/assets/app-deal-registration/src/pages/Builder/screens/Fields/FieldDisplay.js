import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@insight/toolkit-react'

import { Field } from '@components'
import { isRequired } from '@lib'
import { useBuilderField } from  '../../context'
import FieldSet from './FieldSet'
import { StylePicker } from './Styles'

const conditionalOptions = ['Yes', 'No']
const dotValidator = value => {
    if (value.includes('.')) {
        return 'This field cannot have a . in it'
    }
}

const validators = [isRequired, dotValidator]

export default function FieldDisplay({
    addSet,
    dispatcher,
    id,
    sets
}) {
    const { handleFieldChange, isFieldConditional } = useBuilderField()

    const [removeSetEnabled, setRemoveSetEnabled] = useState(false)
    const toggleRemoveSet = () => setRemoveSetEnabled(prev => !prev)

    return (
        <div className="c-builder-field">
            <StylePicker dispatcher={dispatcher} id={id} type="input" />
            <div className="o-grid o-grid--gutters-small">
                <Field
                    className="o-grid__item"
                    handleChange={handleFieldChange}
                    initialValue={isFieldConditional === true ? 'Yes' : 'No'}
                    label="Is field conditional?"
                    name="isConditional"
                    options={conditionalOptions}
                    type="Select"
                />
                <Field
                    className="o-grid__item"
                    handleChange={handleFieldChange}
                    label="Field name"
                    name="name"
                    type="Text"
                    validators={validators}
                />
            </div>
            {sets.map((set, setIndex) => (
                <FieldSet 
                    inputId={id} 
                    key={set.id} 
                    removeSetEnabled={removeSetEnabled} 
                    set={set} 
                    setIndex={setIndex} 
                />
            ))}
            {isFieldConditional && (
                <div className="c-builder-field__set-actions">
                    <Button color="link" onClick={addSet}>Add Input set</Button>
                    {sets && sets.length > 1 && (
                        <Button color="link" onClick={toggleRemoveSet}>
                            {removeSetEnabled ? 'Stop removing sets' : 'Remove sets'}
                        </Button>
                    )}
                </div>
            )}
        </div>
    )
}

FieldDisplay.propTypes = {
    addSet: PropTypes.func.isRequired,
    dispatcher: PropTypes.shape({}),
    id: PropTypes.string.isRequired,
    sets: PropTypes.arrayOf(PropTypes.shape({}))
}