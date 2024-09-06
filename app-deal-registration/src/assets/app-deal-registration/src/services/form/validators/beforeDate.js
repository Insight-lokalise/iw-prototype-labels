import { curry } from '@insight/toolkit-utils'

import { isBeforeDate } from '@lib'


const beforeDate = curry((maxDate, value) => {
    const isInvalid = isBeforeDate(new Date(maxDate), new Date(value))
    if (isInvalid) {
        return `Sorry, your date needs to be before ${maxDate}`
    }
})

export default beforeDate