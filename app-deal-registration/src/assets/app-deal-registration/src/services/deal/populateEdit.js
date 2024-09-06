import retrieveAccountData from './retrieveAccountData'

export default async function populateEdit(passedFields, accountNumber, salesOrg) {
    const { newValues: accountValues, populated } = await retrieveAccountData(accountNumber, salesOrg)
    const newValues = {
        ...accountValues,
        'dealInfo-manufacturer': passedFields.manufacturer || '',
        'dealInfo-program': passedFields.program || ''
    }
    return { newValues, populated }
}