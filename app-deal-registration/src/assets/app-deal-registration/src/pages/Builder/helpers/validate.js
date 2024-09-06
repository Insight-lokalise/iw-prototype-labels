export function validateWhen(fieldName) {
    return value => {
        if (value === fieldName) {
            return 'Sorry, this field cannot be the same as the name of the field it is under'
        }
    }
}