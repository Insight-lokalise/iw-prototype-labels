// At this point we have layouts or a default one has been generated.
// If we are editing, however removing an input does not updated the saved layout
// in case of an edit (this is an oversight and should be addressed, but time constraints)
// So we need to filter from the list of currently existing inputs
export const layoutsSelector = state => {
    const { inputs, layouts } = state.builder
    return Object.keys(layouts).reduce((acc, key) => {
        const { childLayouts, layout: groupLayout } = layouts[key]
        const filteredChildLayouts = childLayouts.filter(({ i }) => !!inputs[i])
        acc.groupLayouts.push(groupLayout)
        acc.layouts[key] = { ...(acc.layouts[key] || {}), childLayouts: filteredChildLayouts, layout: groupLayout }
        return acc
    }, { groupLayouts: [], layouts: {} })
}

export const formSelector = state => {
    const { groups, inputs, layouts, styles } = state.builder
    const base = Object.keys(groups).reduce((acc, key) => {
        const group = groups[key]
        return {
            ...acc,
            groups: acc.groups.concat(group),
            inputs: { ...acc.inputs, [group.id]: group.inputIds.map(id => inputs[id])},
            layouts: { ...acc.layouts, [group.id]: layouts[group.id] },
        }
    }, { groups: [], inputs: {}, layouts: {} })

    const results = base.groups.reduce((acc, group) => {
        const targetKey = group.isUniversal ? 'universal' : 'custom'
        acc[targetKey] = {
            groupIds: (acc[targetKey].groupIds || []).concat(group.id),
            groupLayout: (acc[targetKey].groupLayout || []).concat(base.layouts[group.id].layout),
            groups: (acc[targetKey].groups || []).concat(group),
            inputs: { ...(acc[targetKey].inputs || {}), [group.id]: base.inputs[group.id] },
            layouts: { ...(acc[targetKey].layouts || {}), [group.id]: base.layouts[group.id] },
            styles: { ...(acc[targetKey].styles || {}), [group.id]: styles[group.id]}
        }
        groups[group.id].inputIds.forEach(id => {
            acc[targetKey].styles[id] = styles[id]
        })
        return acc
    }, { custom: {}, isModern: true, universal: {} })
    return results
}