import cuid from 'cuid'

export default function transformOptions({ type, values = [] }) {
    switch (type) {
        case 'Checkbox': return { checkboxLabel: values[0] }
        case 'ListBox': return { options: values.map(val => ({
            label: val,
            value: val
        }))}
        case 'Radio': return { options: values.map(val => ({
            id: cuid(),
            label: val,
            value: val
        }))}
        case 'Select': 
        case 'Dropdown':
            return { options: values }
    }
}