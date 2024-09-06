import { curry } from '@insight/toolkit-utils'

const greaterThan = curry((size, value) => {
    const isInvalid = Number(value) < Number(size)
    if (isInvalid) {
        return `Sorry, your field needs to be greater than ${size}`
    }
})

export default greaterThan