/*
    Converts legacy, v1 custom fields into v2 compatible ones. 

    Unlike universal fields, custom fields do have layouts included in them.
    We need to parse each group and the childLayouts to construct a layouts object
    { [groupId]: { childLayouts: [<InputLayout>], layout: <GroupLayout> }}
*/

export default function convertCustomFields(passedFields) {
    const { inputs, layouts } = Object.keys(passedFields.inputs).reduce((acc, key) => {
        const [groupId] = key.split('-')
        const { id, name, ...rest } = inputs[key]

        if (!acc.inputs[groupId]) {
            acc.inputs[groupId] = []
        }
        acc.inputs[groupId].push({ id, name, sets: [rest] })

        if (!acc.layouts[groupId]) {
            acc.layouts[groupId] = { 
                childLayouts: Object.values(passedFields.childLayouts[groupId]), 
                layout: passedFields.groups[groupId].layout
            }
        }

        return acc
    }, { inputs: {}, layouts: {} })

    const groups = Object.keys(passedFields.groups).map(key => ({
        ...passedFields.groups[groupId],
        inputIds: inputs[groupId].map(({ id }) => id ),
        isUniversal: false
    }))
    
    const groupLayouts = Object.keys(layouts).map(key => layouts[key].layout)

    return { groupLayouts, groups, inputs, layouts }
}