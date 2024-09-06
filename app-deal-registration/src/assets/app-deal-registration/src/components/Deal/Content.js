import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@insight/toolkit-react'

import { Custom, Files, Universal } from './displays'

export default function Content({ 
    handleSubmit,
    isEdit,
    passedFields,
    passedValues,
    populatedDropdowns,
    populatedFields,
    preventSubmission,
    showSubmit,
    topLevelFields
}) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { custom, universal } = passedFields
    const customValues = passedValues && passedValues.custom
    const fileAttachments = (passedValues && passedValues.fileAttachments) || []
    const universalValues = passedValues && passedValues.universal

    
    const handlers = useRef([])
    const registerHandler = handler => {
        handlers.current.push(handler)
    }

    const onSubmit = async () => {

        const formResults = handlers.current.map(handler => handler())
        const isValid = formResults.every(({ isFormValid }) => isFormValid)

        if (!isValid) {
           return handleSubmit(undefined, isValid)
        }

        if (preventSubmission) {
            return
        }
        
        const combinedValues = formResults.reduce((acc, curr) => ({
            ...acc,
            [curr.key]: curr.passedValues
        }), {})
        setIsSubmitting(true)
        await handleSubmit(combinedValues, isValid)
    }

    return (
        <div className="c-deal__content">
            {universal && universal.groups && (<Universal
                isEdit={isEdit}
                passedFields={universal} 
                passedPopulated={populatedDropdowns}
                passedValues={universalValues}
                registerHandler={registerHandler}
                topLevelFields={populatedFields}
            />)}
            <Files passedValues={fileAttachments} registerHandler={registerHandler} />
            <Custom
                passedFields={custom}
                passedValues={customValues}
                registerHandler={registerHandler}
            />
            {showSubmit && (
                <div className="c-deal__submit">
                    <Button color="primary" isLoading={isSubmitting} isDisabled={isSubmitting} onClick={onSubmit}>Submit</Button>
                </div>
            )}
        </div>
    )
}
