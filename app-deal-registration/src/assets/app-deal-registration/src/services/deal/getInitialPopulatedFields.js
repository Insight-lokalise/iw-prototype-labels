import { SALES_ID_TO_ORG_MAP } from '@constants'

export default function getInitialPopulatedFields(passedFields) {
    return {
        'dealInfo-manufacturer': passedFields.manufacturer || '',
        'dealInfo-program': passedFields.program || '',
        'dealInfo-salesOrg': passedFields.salesOrg || SALES_ID_TO_ORG_MAP[passedFields.salesAreaId],
        'dealInfo-sapAccount': 'Yes'
    }
}
