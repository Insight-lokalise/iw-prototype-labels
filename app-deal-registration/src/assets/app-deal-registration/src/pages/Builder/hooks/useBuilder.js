import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import useDispatcher from './useDispatcher'
import useFields from './useFields'
import useLayouts from './useLayouts'
import useSubmission from './useBuilderSubmission'
import useBuilderEvents from './useBuilderEvents'
import useBuilderUpdater from './useBuilderUpdater'

export default function useBuilder({ activeStep, display, isEdit, purpose, setActiveStep }) {
    const dispatch = useDispatch()
    const [isTrackingLayouts, setTrackingLayouts] = useState(isEdit)

    useEffect(() => {
        if (!isTrackingLayouts && activeStep > 1) {
            setTrackingLayouts(true)
        }
    }, [isTrackingLayouts, activeStep])

    const fields = useFields(isEdit)
    const layouts = useLayouts()
    const { events, ...registerEventRefs } = useBuilderEvents()
    const submission = useSubmission({ display, isEdit, purpose })
    const dispatcher = useDispatcher({ dispatch, events, fields, isTrackingLayouts })

    useBuilderUpdater({ activeStep, dispatch, fields, isEdit, layouts, purpose })

    const transitionStep = stepIndex => {
        let shouldTransition = true

        // This is a poor way to do this. Should rely on builder service.
        if (activeStep === 1) {
            const inputs = fields.getFieldValues()
            const errors = fields.validateFields()

            const errorKeys = Object.keys(errors)
            dispatcher.updateFieldState({ errorKeys, inputs, isEdit })

            if (errorKeys.length > 0) {
                shouldTransition = false
                display.addToast({
                    color: 'danger',
                    id: 'builder-invalid-fields',
                    text: <p>Some of your fields are invalid</p>
                })
            }
        } else if (activeStep === 2) {
            dispatcher.updateLayouts(layouts.getLayouts())
        }

        if (shouldTransition) {
            setActiveStep(prev => stepIndex)
        }
    }

    return { dispatcher, fields, layouts, submission, transitionStep, ...registerEventRefs }
}