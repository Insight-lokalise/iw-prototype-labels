const formatSection = ({ groups, inputs }) => Object.keys(groups).reduce((acc, key) => {
    const group = groups[key].display
        ? groups[key]
        : { ...groups[key], display: `${groups[key].name.split(' ').join('')}`}
    acc.groups.push(group)
    acc.inputs[key] = group.inputIds.map(inputId => inputs[inputId])
    return acc
}, { groups: [], inputs: {} })

const createGroupLayout = ({ groupIds, layouts }) => groupIds.map(id => layouts[id].layout)

export default function convertToDealStructure({ custom, fileAttachments = [], universal }) {
    const hasUniversal = universal && universal.groups
    return {
        custom: {
            ...custom,
            ...(formatSection(custom)),
            groupLayout: createGroupLayout(custom)
        },
        fileAttachments,
        universal: hasUniversal ? { ...universal, ...formatSection(universal) } : {}
    }
}
