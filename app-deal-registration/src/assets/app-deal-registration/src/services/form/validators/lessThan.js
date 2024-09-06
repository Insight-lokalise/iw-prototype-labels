import { curry } from '@insight/toolkit-utils'

const lessThan = curry((size, value) => {
    const isInvalid = Number(value) > Number(size)
    if (isInvalid) {
        return `Sorry, your field needs to be less than ${size}`
    }
})

export default lessThan