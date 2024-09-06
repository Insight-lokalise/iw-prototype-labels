import cuid from 'cuid'
import { INITIAL_STYLE_STATE } from '@state/builder/constants'

export function generateConditional() {
    return { id: cuid(), is: '', when: '' }
}

export function generateValidator() {
    return { id: cuid(), is: '', type: '', when: '', value: ''}
}

export function generateSetData(inputId) {
    // If this could be groupId instead.. then we could have a byGroupId: { "groupId": [{sets}]}
    const setId = cuid()
    return {
        conditionalGroups: [{
            conditionals: [generateConditional()],
            id: cuid()
        }],
        defaultValue: '',
        display: '',
        helpText: '',
        id: setId,
        inputId,
        is: '',
        label: '',
        placeholder: '',
        type: '',
        validators: [generateValidator()],
        when: '',
        values: ''
    }
}

export function generateInputData(groupId, passedInputId) {
    const inputId = passedInputId || `${groupId}-${cuid()}`
    const set = generateSetData(inputId)
    return {
        groupId,
        input: {
            id: inputId,
            isConditional: false,
            name: '',
            sets: [set]
        },
        inputId,
    }
}

export function generateGroupData(isUniversal) {
    const groupId = cuid()
    const { input, inputId } = generateInputData(groupId)

    return {
        group: {
            header: '',
            id: groupId,
            inputIds: [inputId],
            name: '',
            isUniversal
        },
        groupId,
        input,
        inputId,
    }
}

export function generateBuilderData() {
    const { group, groupId, input, inputId } = generateGroupData()
    return {
        groupIds: [groupId],
        groups: { [groupId]: group },
        inputs: { [inputId]: input },
        styles: { [groupId]: INITIAL_STYLE_STATE, [inputId]: INITIAL_STYLE_STATE }
    }
}

export function generateFormFields({ custom, universal }) {
    return {
        groupIds: [...universal.groupIds, ...custom.groupIds],
        groups: { ...universal.groups, ...custom.groups },
        inputs: { ...universal.inputs, ...custom.inputs },
        layouts: { ...universal.layouts, ...custom.layouts },
        styles: { ...universal.styles, ...custom.styles }
    }
}