export default function customAdapter(field, context) {
    const { groupDisplay, handlers } = context
    if (field.values && field.values.length > 0) {
        field.values = field.values.split(',')
    }

    field.handleChange = handlers['field']
    return field
}