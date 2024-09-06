import cuid from 'cuid'

import { INITIAL_STYLE_STATE } from '../constants'

const formatInputConditonals = groups => {
    const keys = Object.keys(groups)
    if (keys.length > 0) {
        return keys.reduce((conditionals, conditionalKey) => {
            const group = groups[conditionalKey]
            return [...conditionals, { conditionals: group, id: cuid()}]
        }, [])
    }
}

const getLayoutsForField = custom => {
    // This is an odd case where there have been a few forms that have been altered
    if (custom.layouts) {
        return custom.layouts
    }

    return Object.keys(custom.groups).reduce((acc, key) => {
        const { layout } = custom.groups[key]
        const childLayouts = Object.keys(custom.childLayouts[key]).map(childKey => custom.childLayouts[key][childKey])
        acc[key] = { childLayouts, layout }
        return acc
    }, {})
}

export default function convertLegacyFields({ formFields }) {
    const { custom, universal } = formFields
    const combinedGroups = { ...custom.groups, ...universal.groups }
    const combinedInputs = { ...custom.inputs, ...universal.inputs }

    const groupKeys = Object.keys(combinedGroups)
    const inputKeys = Object.keys(combinedInputs)

    const inputsByGroups = inputKeys.reduce((acc, key) => {
        const [groupId] = key.split('-')
        return { ...acc, [groupId]: [...(acc[groupId] || []), key]}
    }, {})

    const inputs = inputKeys.reduce((acc, key) => {
        const { conditionalGroups = {}, id, name, sets, type, ...rest } = combinedInputs[key]
        const inputConditionals = formatInputConditonals(conditionalGroups)
        const fieldType = type === 'Dropdown' ? 'Select' : type
        const inputSets = sets && sets.length > 0 ? sets : [{...rest, conditionalGroups: inputConditionals, id: cuid(), type: fieldType }]
        acc[key] = { id, name, isConditional: sets && sets.length > 1, sets: inputSets }
        return acc
    }, {})

    const groups = groupKeys.reduce((acc, key) => ({
        ...acc,
        [key]: {
            ...combinedGroups[key],
            inputIds: inputsByGroups[key],
            isUniversal: !combinedGroups[key].layout
        }
    }), {})

    const styles = [...groupKeys, ...inputKeys].reduce((acc, key) => ({
        ...acc,
        [key]: INITIAL_STYLE_STATE
    }), {})

    const layouts = getLayoutsForField(custom)

    return { groupIds: groupKeys, groups, inputs, layouts, styles }
}