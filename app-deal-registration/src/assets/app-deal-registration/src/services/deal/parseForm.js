import { transformSets } from '@services/form'

const POPULATABLE_FIELD_LIST = ['billToNumber', 'contactNumber', 'shipToNumber']

const getDefaultValue = type => {
    if (type === 'Listbox' || type === 'ListBox') {
        return []
    }
    if (type === 'Date') {
        return null
    }
    return ''
}

function parseUniversalForm(values) {
    const actualValues = {
        ...values,
        'fieldRepInfo-fieldRepEmail': values['fieldRepInfo-fieldRepEmail'] || ' ',
        'fieldRepInfo-fieldRepName': values['fieldRepInfo-fieldRepName'] || ' ',
        'notificationEmails-notificationEmails': (values['notificationEmails-notificationEmails'] || []).filter(Boolean)
    }

    return Object.keys(actualValues).reduce((acc, key) => {
        const [groupDisplay, fieldDisplay] = key.split('-')
        const value = actualValues[key] || ' '
        const passedValue = POPULATABLE_FIELD_LIST.includes(fieldDisplay)
            ? value.split(';')[0]
            : value            
        return {
            ...acc,
            [groupDisplay]: {
                ...acc[groupDisplay],
                [fieldDisplay]: passedValue
            }
        }
    }, {})
}

/*
    Ensure that the values of the form are returned in the order they are defined in the layout.
    We also need to take care for input sets here. The inputs we are filtering through have not been converted
    into fields, so we need parse their sets here to determine the current active one
*/
// This will sort the values from the form in the order that they are defined
// in the layout
function parseCustomForm({ groups, inputs, layouts, values }) {
    return groups.reduce((acc, group) => {
        const { childLayouts } = layouts[group.id]
        const targetInputs = inputs[group.id]
        for (const childLayout of childLayouts) {
            const input = targetInputs.find(({ id }) => id === childLayout.i)
            let currentSet = transformSets(input.sets, values)
            
            // If there is no current set for this input then it is a hidden field. For bot scripts, we should at least return something for one of these fields. 
            if (currentSet === 'no-matching-set') {
                currentSet = input.sets[0]
            }

            acc[currentSet.display] = values[input.name] || getDefaultValue(currentSet.type)
        }
        return acc
    }, {})
}

export default function parseForm(values, key) {
    return key === 'custom' ? parseCustomForm(values) : parseUniversalForm(values)
}
