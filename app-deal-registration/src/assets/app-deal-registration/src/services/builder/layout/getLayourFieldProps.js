
function getDefaultValueFromType({ passedDefault, type }) {
    const defaultValueKey = type === 'ListBox' ? 'selected' : 'initialValue'
    const defaultValueReplacement = type === 'ListBox' ? [] : ''
    return {
        [defaultValueKey]: (passedDefault || defaultValueReplacement)
    }
}

export default function getLayoutFieldProps(passedField) {
    const {
        defaultValue: passedDefault,
        label,
        name,
        type,
        values
    } = passedField

    const field = {
        ...getDefaultValueFromType({ passedDefault, type }),
        label,
        name,
        type
    }

    if (type === 'Select') {
        field.fullWith = true
    }

    if (values && values.length > 0) {
        field.options = Array.isArray(values) ? values : values.split(',')
    }

    return field
}