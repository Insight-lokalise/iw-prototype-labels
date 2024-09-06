import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@insight/toolkit-react'

import { generateValidator } from '@services/builder'
import Validator from './Validator'

export default function Validators({ initialValidators, inputType, prefix, updateValidators }) {
    const [removeEnabled, setRemoveEnabled] = useState(false)
    const [validators, setValidators] = useState(initialValidators.filter(Boolean))

    useEffect(() => {
        if (removeEnabled && !validators.length > 0) {
            setRemoveEnabled(false)
        }
    })

    const toggleRemove = () => setRemoveEnabled(prev => !prev)
    
    const addValidator = () => {
        const validator = generateValidator()
        setValidators(prev => [...prev, validator])
        updateValidators({ action: 'add-validator', value: validator })
    }
    
    const removeValidator = ({ id, validatorIndex }) => {
        const newValidators = validators.filter(item => item.id !== id)
        setValidators(prev => newValidators)
        updateValidators({ action: 'remove-validator', validatorIndex })
    }

    return (
        <div className="c-builder-field__validators">
            {validators.map((validator, index) => (
                <Validator 
                    inputType={inputType}
                    key={validator.id} 
                    prefix={`${prefix}.${index}`}
                    removeEnabled={removeEnabled}
                    removeValidator={removeValidator}
                    updateValidators={updateValidators}
                    validator={validator}
                    validatorIndex={index}
                />
            ))}
            <Button color="link" onClick={addValidator}>Add Validator</Button>
            <Button color="link" onClick={toggleRemove}>{removeEnabled ? 'Cancel Removing' : 'Remove Enabled'}</Button>
        </div>
    )
}

Validators.propTypes = {
    initialValidators: PropTypes.arrayOf(PropTypes.shape({})),
    inputType: PropTypes.string.isRequired,
    prefix: PropTypes.string.isRequired,
    updateValidators: PropTypes.func.isRequired
}