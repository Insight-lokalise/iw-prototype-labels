export default function required() {
    return value => {
        if (!value) {
            return 'Sorry, this field is required'
        }
    }
}