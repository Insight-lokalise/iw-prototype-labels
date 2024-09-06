const getPropsForGroup = ({ inputs, styles }) => {
    return ({ inputIds }) => inputIds.reduce((acc, inputId) => ({
        groupInputs: { ...acc.groupInputs, [inputId]: inputs[inputId] },
        groupStyles: { ...acc.groupStyles, [inputId]: styles[inputId] }
    }), {})
}
const getTargetKey = group => group.isUniversal ? 'universal' : 'custom'

export default function convertToSubmitStructure(passedFields) {
    const { groupIds, groups, inputs, layouts, styles } = passedFields
    const groupPropGetter = getPropsForGroup(passedFields)
    
    return groupIds.reduce((acc, groupId) => {
        const group = groups[groupId]
        const targetKey = getTargetKey(group)
        const { groupInputs, groupStyles } = groupPropGetter(group)
        return { ...acc, [targetKey]: {
            groupIds: (acc[targetKey].groupIds || []).concat(groupId),
            groups: { ...(acc[targetKey].groups || {}), [groupId]: group },
            inputs: { ...(acc[targetKey].inputs || {}), ...groupInputs },
            layouts: { ...(acc[targetKey].layouts || {}), [groupId]: (layouts[groupId] || {})},
            styles: { ...(acc[targetKey].styles || {}), [groupId]: styles[groupId], ...groupStyles }
        }}
    }, { custom: {}, universal: {} })
}