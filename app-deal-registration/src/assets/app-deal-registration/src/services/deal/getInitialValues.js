const getInitialUniversalValues = ({ groups, inputs }) => {
    return groups.reduce((acc, group) => {
        const { display: groupDisplay, id } = group
        inputs[id].forEach(({ sets, name }) => {
            const defaultValue = sets[0].defaultValue ? sets[0].defaultValue : ''
            let initialValue = defaultValue
            if(groupDisplay === 'notificationEmails') {
                initialValue = defaultValue === '' ? [] : [defaultValue]
            }
            acc[`${groupDisplay}-${name.split('-')[1]}`] = initialValue
        })
        return acc
    }, {})
}

const getInitialCustomValues = ({ groups, inputs }) => {
    return groups.reduce((acc, { id, name: groupName }) => {
        inputs[id].forEach(({ sets, name }) => {
            const defaultValue = sets[0].defaultValue ? sets[0].defaultValue : ''
            acc[name] = defaultValue
        })
        return acc
    }, {})
}

const getUniversalEditValues = passedValues => {
    return Object.keys(passedValues).reduce((acc, curr) => {
        const group = passedValues[curr]
        Object.keys(group).forEach(groupKey => {
            const name = `${curr}-${groupKey}`
            acc[name] = group[groupKey]
        })
        return acc
    }, {})
}

const getCustomEditValues = (passedValues, passedFields) => {
    return Object.keys(passedFields.inputs).reduce((acc, key) => {
        const fields = passedFields.inputs[key]
        for (const field of fields) {
            for (const set of field.sets) {
                if (passedValues[set.display]) {
                    acc[field.name] = passedValues[set.display]
                    break
                }
            }
        }
        return acc
    }, {})
}
export default function getInitialValues({ passedFields, passedValues, topLevelFields, type }) {
    if (passedValues) {
        if (type === 'universal') {
            return getUniversalEditValues(passedValues)
        }
        return getCustomEditValues(passedValues, passedFields)
    }

    if (type === 'universal') {
        return { ...getInitialUniversalValues(passedFields), ...topLevelFields }
    }

    return getInitialCustomValues(passedFields)
}
