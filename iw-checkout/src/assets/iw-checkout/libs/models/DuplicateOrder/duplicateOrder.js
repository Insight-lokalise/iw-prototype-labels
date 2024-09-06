import { getUTCTimeStamp } from '@insight/toolkit-utils'

import { post } from '../fetch'

export function duplicateOrder() {
    const data = { data: { clientBrowserDate: getUTCTimeStamp() } }
    return post('/insightweb/transaction/duplicateOrder', data)
        .catch((error) => {
            console.warn('Duplicate order failed')
            throw error // re-throw error for initial testing of functionality
        })
        .then(() => {
            window.location = '/insightweb/viewCart'
        })
}
