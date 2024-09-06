import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@insight/toolkit-react'

import Conditionals from './Conditionals/Conditionals'
import Validators from './Validators/Validators'

const getFieldNamePath = name => {
    const splitName = name.split('.')
    return splitName[splitName.length - 1]
}

export default function Optional({ conditionalGroups = [], prefix, type, validators = [] }) {
    // Keep track of the optional field state here since the children can unmount.
    // But since the <Field /> tracks each value internally, it doesn't need to trigger
    // a re-render. So we keep this in a ref.
    // -- All events that <Field /> will receive/emit will be the same priority. So this
    //    is still concurrent approved
    console.log(validators)
    const storedConditionals = useRef(conditionalGroups)
    const storedValidators = useRef(validators)
 
    const [showConditionals, setShowConditionals] = useState(false)
    const [showValidators, setShowValidators] = useState(false)
    const toggleConditionals = () => setShowConditionals(prev => !prev)
    const toggleValidators = () => setShowValidators(prev => !prev)

    // This probably needs to get moved to the service and subscribed to
    const updateConditionals = ({ action, conditionalIndex, groupIndex, name, value }) => {
        switch (action) {
            case 'add-conditional': {
                storedConditionals.current[groupIndex].conditionals.push(value)
                break
            }
            case 'add-group': {
                storedConditionals.current.push(value)
                break
            }
            case 'remove-conditional': {
                storedConditionals.current[groupIndex].splice(conditionalIndex, 1)
                break
            }
            case 'remove-group': {
                storedConditionals.current.splice(groupIndex, 1)
                break
            }
            case 'update-conditional': {
                const targetName = getFieldNamePath(name)
                storedConditionals.current[groupIndex].conditionals[conditionalIndex][targetName] = value
                break
            }
        }
    }
    const updateValidators = ({ action, name, validatorIndex, value }) => {
        switch (action) {
            case 'add-validator': {
                storedValidators.current.push(value)
                break
            }
            case 'update-validator': {
                const splitName = getFieldNamePath(name)
                storedValidators.current[validatorIndex][splitName] = value
                break
            }
            case 'remove-validator': {
                storedValidators.current.splice(validatorIndex, 1)
            }
        }
    }

    return (
        <div className="c-builder-field__optional">
            {showValidators && (
                <Validators
                    initialValidators={storedValidators.current}
                    inputType={type}
                    prefix={`${prefix}.validators`}
                    updateValidators={updateValidators}
                />
            )}
            {showConditionals && (
                <Conditionals 
                    initialConditionals={storedConditionals.current} 
                    prefix={`${prefix}.conditionalGroups`} 
                    updateConditionals={updateConditionals}    
                />
            )}
            <div className="c-builder-field__optional-actions">
                <Button color="link" onClick={toggleConditionals}>
                    {showConditionals ? 'Hide Conditionals' : 'Show Conditionals'}
                </Button>
                <Button color="link" onClick={toggleValidators}>
                    {showValidators ? 'Hide Validators' : 'Show Validators'}
                </Button>
            </div>
        </div>
    )
}

Optional.propTypes = {
    conditionalGroups: PropTypes.arrayOf(PropTypes.shape({
        conditionals: PropTypes.arrayOf(PropTypes.shape({})),
        id: PropTypes.string
    })),
    prefix: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    validators: PropTypes.arrayOf(PropTypes.shape({}))
}