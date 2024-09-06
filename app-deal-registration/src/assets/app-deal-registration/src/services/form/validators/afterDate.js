import { curry } from '@insight/toolkit-utils'

import { isAfterDate } from '@lib'

const afterDate = curry((oldestDate, value) => {
    const isInvalid = isAfterDate(new Date(oldestDate), new Date(value))
    if (isInvalid) {
        return `Sorry, your date needs to be after ${oldestDate}`
    }
})

export default afterDate
