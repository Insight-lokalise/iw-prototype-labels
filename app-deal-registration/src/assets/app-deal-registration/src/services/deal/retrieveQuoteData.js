import { getQuoteData } from '@api';
import { uppercaseFirst } from '@lib';
import { FORM_FIELD_LABELS, FORM_FIELD_PREFIX_MAP, SHIP_TO_FIELD_KEYS } from 'constants';


const getKeyMapping = key => {
    if (key === 'street') {
        return 'Address';
    }
    if (key === 'id') {
        return 'ID';
    }
    if (key === 'phoneExt') {
        return 'Ext';
    }
    return uppercaseFirst(key);
}

const mappedValues = (obj = {}, prefix) => {
    const values = Object.keys(obj).reduce((acc, key) => {
        const name = getKeyMapping(key);
        const value = obj[key] || '';
        acc[`${prefix}${name}`] = value.trim();
        return acc;
    }, {});

    return values;
}

export default async function retrieveQuoteData(quoteNumber) {
    if (!quoteNumber) return false;

    const response = await getQuoteData(quoteNumber);

    const {
        accountNumber: { customerSoldto, salesOrg } = {},
        accountAddress,
        shipToInfo,
        repInfo,
        contactInfo
    } = response?.DealRegDocument || {};

    const { accountPrefix, shipToPrefix, repPrefix, contactPrefix } = FORM_FIELD_PREFIX_MAP;

    // account address information
    const accountValuesWithNumber = { ...accountAddress, number: customerSoldto };
    const accountValues = mappedValues(accountValuesWithNumber, accountPrefix);

    // shipto information
    const shipToValues = mappedValues(shipToInfo, shipToPrefix);

    // rep information
    const repValues = mappedValues(repInfo, repPrefix);

    // contact information
    const contactValues = mappedValues(contactInfo, contactPrefix);

    return {
        newValues: {
            ...accountValues,
            ...shipToValues,
            ...repValues,
            ...contactValues,
            [FORM_FIELD_LABELS.salesOrg]: salesOrg
        },
        customerSoldto,
        salesOrg
    }
}

const createShipToListItem = (values) => {
    const prefix = FORM_FIELD_PREFIX_MAP.shipToPrefix;
    const numberField = values[`${prefix}Number`];
    const addDelimeter = (index) => index !== SHIP_TO_FIELD_KEYS.length - 1 ? ';' : '';
    const remainingField = SHIP_TO_FIELD_KEYS.reduce((acc, key, index) => {
        const value = values[`${prefix}${key}`];
        if (!value) return acc;
        acc = acc + `${value}${addDelimeter(index)}`;
        return acc;
    }, '');

    return `${numberField}: ${remainingField}`;
}

export const mapShipToValuesFromQuote = (shipToValues, newValues) => {
    const shipToNumber = newValues[FORM_FIELD_LABELS.shipToNumber] || '';
    const updatedShipToNumber = shipToNumber.replace(/^0+/, '').trim();
    let mappedValue = updatedShipToNumber && shipToValues.find(value => {
        const shipToId = value.split(':')[0];
        return updatedShipToNumber === shipToId && value;
    });

    if (mappedValue) {
        return {
            mappedValue: mappedValue,
            shipToPresent: true
        };
    };
    mappedValue = createShipToListItem(newValues);
    return {
        mappedValue: mappedValue,
        shipToPresent: false
    };
}