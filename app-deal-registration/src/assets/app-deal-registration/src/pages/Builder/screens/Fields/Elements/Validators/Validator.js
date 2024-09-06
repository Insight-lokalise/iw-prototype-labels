import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@insight/toolkit-react'

import { Field } from '@components'
import {
    ALLOWED_VALIDATORS_FOR_TYPE,
    VALUE_VALIDATOR_TYPES
} from '@pages/Builder/constants'
import { useBuilderField } from '@pages/Builder/context'
import { validateWhen } from '@pages/Builder/helpers'

export default function Validator({ 
    inputType,
    prefix,
    removeEnabled,
    removeValidator,
    updateValidators,
    validator,
    validatorIndex
}) {
    const { fieldName } = useBuilderField()
    const [validatorType, setValidatorType] = useState(validator.type)
    const handleFieldChange = ({ target: { name, value }}) => {
        updateValidators({ action: 'update-validator', name, validatorIndex, value })
        if (name === `${prefix}.type`) {
            setValidatorType(prev => value)
        }
    }
    const handleRemove = () => {
        removeValidator({ id: validator.id, validatorIndex })
    }

    return (
        <div className="o-grid o-grid--gutters-small">
            {removeEnabled && (
                <Button className="o-builder-field__validator-remove" icon="trashcan" onClick={handleRemove} />
            )}
            <Field
                className="o-grid__item"
                fullWidth
                handleChange={handleFieldChange}
                hasNoInitialSelection
                initialValue={validator.type}
                label="Type"
                name={`${prefix}.type`}
                options={ALLOWED_VALIDATORS_FOR_TYPE[inputType]}
                type="Select"
            />
            {VALUE_VALIDATOR_TYPES.includes(validatorType) && (
                <Field
                    className="o-grid__item"
                    handleChange={handleFieldChange}
                    label="Value"
                    name={`${prefix}.value`}
                    type="Text"
                />
            )}
            {validatorType === 'conditionalRequired' && (
                <div className="o-grid__item u-2/3">
                    <div className="o-grid o-grid--gutters-small">
                        <Field
                            className="o-grid__item"
                            label="When"
                            name={`${prefix}.when`}
                            type="Text"
                            validators={[validateWhen(fieldName)]}
                        />
                        <Field
                            className="o-grid__item"
                            label="Is"
                            name={`${prefix}.is`}
                            type="Text"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

Validator.propTypes = {
    inputType: PropTypes.string.isRequired,
    prefix: PropTypes.string.isRequired,
    removeEnabled: PropTypes.bool.isRequired,
    removeValidator: PropTypes.func.isRequired,
    updateValidators: PropTypes.func.isRequired,
    validator: PropTypes.shape({}),
    validatorIndex: PropTypes.number
}