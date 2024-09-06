import { post } from './../fetch'

/**
 * Post request that saves proration start date
 * @param  {object} payload {{ contractMaterialIdsList: [
 *                               { contractId: '0040023426',
                                   childMaterialIDKey: 0,
                                   materialIDKey: 1,
                                   proratableDate: 13,
                                   proratableMonth: 3,
                                   proratableYear: 2017,
                                   proratableDateObject: '3/13/2017' }
                              ]
                            }}
 * @return {cart response}         [stadard cart object]
 */
export function saveProrationUsageDate(payload) {
    const timestamp = (new Date()).getTime()
    return post(`transaction/saveProrationUsageDate?_=${timestamp}`, payload)
        .catch((error) => {
            console.warn(`Failed to save usage date: ${JSON.stringify(payload)}`)
            throw error
        })
}
