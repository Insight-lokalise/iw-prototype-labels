import { INITIAL_STYLE_STATE } from '../constants'
import schemaUs from './schema-us'
import schemaEmea from './schema-emea'

export default function createUniversalTemplate(region) {
    const schema = region === 'EMEA' || region === 'EMEX' ? schemaEmea : schemaUs
    return createTemplate(schema)
}

function createTemplate(schema) {
    return schema.reduce((acc, group) => {
        const { inputs, ...groupData } = group
        const { inputIds, groupInputs, inputStyles } = inputs.reduce((inputCol, input) => {
            inputCol.groupInputs[input.id] = input
            inputCol.inputIds.push(input.id)
            inputCol.inputStyles[input.id] = INITIAL_STYLE_STATE
            return inputCol
        }, { groupInputs: {}, inputIds: [], inputStyles: {} })
        return {
            ...acc,
            groupIds: [...acc.groupIds, group.id],
            groups: {
                ...acc.groups,
                [group.id]: { ...groupData, inputIds }
            },
            inputs: { ...acc.inputs, ...groupInputs },
            layouts: {},
            styles: { ...acc.styles, ...inputStyles, [group.id]: INITIAL_STYLE_STATE }
        }
    }, { groupIds: [], groups: {}, inputs: {}, layouts: {}, styles: {}})
}
