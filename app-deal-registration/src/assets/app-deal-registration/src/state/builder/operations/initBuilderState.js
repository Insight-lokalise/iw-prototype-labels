import { convertLegacyFields } from '@services/builder'
import { initBuilder } from '../actions'

const getCombinedFields = ({ custom, universal }) => ({
    groups: { ...custom.groups, ...universal.groups },
    inputs: { ...custom.inputs, ...universal.inputs },
    styles: { ...custom.styles, ...universal.styles }
})

export default function initBuilderState(passedInputs, isModern = false) {
    return dispatch => {
        if (isModern) {
            return dispatch(initBuilder(passedInputs))
        }

        const { formFields } = passedInputs
        const { groups, inputs, styles } = getCombinedFields(formFields)
        const isSavedModernForm = formFields && formFields.isModern
        if (isSavedModernForm) {
            return dispatch(initBuilder({
                groupIds: Object.keys(groups),
                groups,
                inputs,
                layouts: formFields && formFields.custom && formFields.custom.layouts,
                styles
            }))
        }

        dispatch(initBuilder(convertLegacyFields(passedInputs)))
    }
}