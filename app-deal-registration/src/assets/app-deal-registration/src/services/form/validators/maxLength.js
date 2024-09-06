import { curry } from '@insight/toolkit-utils'

const maxLength = curry((length, value) => {
    const isInvalid = value && value.length > length
    if (isInvalid) {
        return `Your field can't be longer than ${length} characters`
    }
})

export default maxLength