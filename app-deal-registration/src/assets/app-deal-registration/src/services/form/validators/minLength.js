import { curry } from '@insight/toolkit-utils'

const minLength = curry((length, value) => {
    const isInvalid = value && value.length < length
    if (isInvalid) {
        return `Sorry, your field needs to be longer than ${length} characters`
    }
})

export default minLength