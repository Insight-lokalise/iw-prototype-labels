import { getAccountData } from '@api';
import { uppercaseFirst } from '@lib';
import { FORM_FIELD_PREFIX_MAP } from 'constants';

const getRepKey = key => {
    if (key === 'repId') {
        return 'repID';
    }
    if (key === 'repPhoneExt') {
        return 'repExt';
    }
    return key;
}
export default async function retrieveAccountData(accountNumber, salesOrg) {
    if (!accountNumber || !salesOrg) {
        return false ;
    }

    const {
        accountAddress,
        accountNumber: returnedAccountNumber,
        billToNumbers,
        contactNumbers,
        shipToNumbers,
        ...repFields
    } = await getAccountData(accountNumber, salesOrg);
    
    const accountValues = accountAddress && Object.keys(accountAddress).reduce((acc, key) => {
        const prefix = FORM_FIELD_PREFIX_MAP.accountPrefix;
        const name = key !== 'street' ? uppercaseFirst(key) : 'Address';
        if (accountAddress && accountAddress[key]) {
            acc[`${prefix}${name}`] = accountAddress[key];
        }
        return acc;
    }, {});

    const repValues = repFields && Object.keys(repFields).reduce((acc, key) => {
        const name = `repInfo-${getRepKey(key)}`
        acc[name] = repFields[key] || ''
        return acc
    }, {});

    return {
        accountNumber: returnedAccountNumber,
        newValues: { ...accountValues, ...repValues },
        populated: { billToNumbers, contactNumbers, shipToNumbers }
    }
}
