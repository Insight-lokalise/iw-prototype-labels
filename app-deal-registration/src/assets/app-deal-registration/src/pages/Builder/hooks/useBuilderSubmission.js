import React, { useRef } from 'react'

import {
    activateForm,
    activateTemplate,
    updateForm,
    updateTemplate
} from '@api'
import { getFormName, parseSubmissionArgs } from '../helpers'

export default function useBuilderSubmission({ display, isEdit, isTemplate, purpose }) {
    const purposeState = purpose.getPurpose()
    const passedValuesRef = useRef(null)
    const statusGetterRef  = useRef('NEW')
    const formName = getFormName(purposeState, isEdit)

    const registerPassedValues = ({ passedValues, statusGetter }) => {
        passedValuesRef.current = passedValues
        statusGetterRef.current = statusGetter
    }

    const handleSave = async (passedValues) => {
        const args = parseSubmissionArgs({ isEdit, passedValues, purposeState })
        const response = await updateForm(args)
        if (response && !response.error) {
            const updatedForm = { ...args, formId: response }
            purpose.updatePurposeKey({ key: 'selectedForm', value: updatedForm })
            return updatedForm
        }
    }

    const afterSuccess = () => {
        window.localStorage.removeItem(formName)
    }

    const saveForm = async ()=> {
        const passedValues = { ...passedValuesRef.current, queueStatus: statusGetterRef.current() }
        const response = await handleSave(passedValues)
        if (response && !response.error) {
            display.addToast({
                color: 'success',
                id: 'save-form-success',
                text: <p>Form saved successfully</p>
            })
            afterSuccess()
        }
        return false
    }

    const saveAndActivateForm = async () => {
        const passedValues = { ...passedValuesRef.current, queueStatus: statusGetterRef.current() }
        const { formId, versionId } = await handleSave(passedValues)
        const response = await activateForm({ formId, versionId })
        if (response && !response.error) {
            display.addToast({
                color: 'success',
                id: 'activate-form-success',
                text: <p>Form saved successfully</p>
            })
            afterSuccess()
            return response
        }
    }

    return {
        registerPassedValues,
        saveAndActivateForm,
        saveForm
    }
}