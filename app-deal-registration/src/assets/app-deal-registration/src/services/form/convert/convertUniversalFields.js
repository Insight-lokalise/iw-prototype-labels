/*
    This takes in the universal form fields and converts them from their
    v1 format to their v2 format.

    Universal fields do contain layouts. This could change as more templates are added

    returns { groups, inputs }
*/

export default function convertUniversalFields({
    groups,
    inputIds,
    inputs
}) {
    const formattedInputs = Object.keys(inputs).reduce((acc, key) => {
        const [groupId] = key.split('-')
        const { id, name, ...rest } = inputs[key]
        return { ...acc, [groupId]: [
            ...(acc[groupId] || []), 
            { id, name, sets: [rest] }
        ]}
    }, {})
    const formattedGroups = Object.keys(groups).map(key => ({
        ...groups[key],
        inputIds: formattedInputs[key].map(({ id }) => id),
        isUniversal: true
    }))
    return { groups: formattedGroups, inputs: formattedInputs }
}