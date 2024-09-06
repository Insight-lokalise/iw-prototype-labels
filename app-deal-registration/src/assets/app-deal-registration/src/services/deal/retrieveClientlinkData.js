import { getClientlinkData } from '@api'
import { DATE_FORMAT } from '@constants'
import { formatDate } from '@lib'

export default async function retrieveClientlinkData(pathArgs, currentUser) {
    const response = await getClientlinkData(pathArgs, currentUser)
    if (response) {
        const closeDate = response.expectedCloseDate && new Date(parseInt(response.expectedCloseDate, 10))
        return {
            'dealInfo-quoteNumber': response.quoteNumber || '',
            'misc-probabilityOfClosing': response.probabilityOfClosing ? `${response.probabilityOfClosing.split('.')[0]}%` : '',
            'misc-opptyRevAmt': response.opptyRevAmt ? `${response.opptyRevAmt.split('.')[0]}` : '',
            'misc-expectedCloseDate': closeDate && formatDate(closeDate, DATE_FORMAT)
        }
    }
    return baseData
}
