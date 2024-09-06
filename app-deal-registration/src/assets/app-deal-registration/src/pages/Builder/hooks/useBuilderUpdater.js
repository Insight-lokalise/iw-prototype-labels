import React from 'react'

import { useInterval } from '@hooks'
import { pollUpdates } from '@state/builder'
import { getFormName } from '../helpers'

export default function useBuilderUpdate({ activeStep, dispatch, fields, isEdit, layouts, purpose }) {
    const formName = getFormName(purpose.getPurpose(), isEdit)

    const getDataForStep = step => {
        switch (step) {
            case 1: return fields.getFieldValues()
            case 2: return layouts.getLayouts()
        }
    }

    useInterval(() => {
        dispatch(pollUpdates({
            activeStep,
            data: getDataForStep(activeStep),
            formName
        }))
    }, activeStep === 4 ? null : 10000)
}