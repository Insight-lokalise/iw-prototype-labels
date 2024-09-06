import retrieveAccountData from './retrieveAccountData';
import retrieveClientlinkData from './retrieveClientlinkData';
import { parseSalesOrg, removeLeadingZeroes } from 'pages/shared/DealWrapper/utils/helpers';
import retrieveQuoteData, { mapShipToValuesFromQuote } from './retrieveQuoteData';
import { FORM_FIELD_LABELS } from 'constants';

export default async function populateClientlinkEntry(pathArgs, currentUser) {
    let salesOrg = parseSalesOrg(pathArgs.salesOrg), soldTo;
    
    let quoteValues = {}, customerSoldto, salesOrgId, quoteNumber;
    try {
        quoteNumber = removeLeadingZeroes(pathArgs.quoteNumber);
        if (quoteNumber) {
            // call quoteAPI to get details
            const quoteData = await retrieveQuoteData(quoteNumber);
            ({newValues: quoteValues, customerSoldto, salesOrg: salesOrgId} = quoteData || {});
        }
    } catch (e) {
        console.warn(`Failed to fetch Quote data: `,e);
    }

    soldTo = customerSoldto || pathArgs.soldTo;
    salesOrg = salesOrgId || salesOrg;

    const [accountData, clientlinkData] = await Promise.all([
        retrieveAccountData(soldTo, salesOrg),
        retrieveClientlinkData(pathArgs, currentUser)
    ]);

    if (accountData && clientlinkData) {
        const { accountNumber, newValues: accountValues, populated } = accountData;
        return {
            newValues: {
                // Account API Data
                ...getValuesUsingAccountData(accountValues, clientlinkData, salesOrg, accountNumber),
                // Quote API Data
                ...getValuesUsingQuoteData(quoteNumber, quoteValues, populated, customerSoldto),
            },
            populated
        };
    }
}

const getValuesUsingAccountData = (accountValues, clientlinkData, salesOrg, accountNumber) => {
    return {
        ...accountValues,
        ...clientlinkData,
        [FORM_FIELD_LABELS.salesOrg]: salesOrg,
        [FORM_FIELD_LABELS.accountNumber]: accountNumber,
    }
}


const getValuesUsingQuoteData = (quoteNumber, quoteValues = {}, populated, customerSoldto) => {
    if (!quoteNumber || !customerSoldto) {
        return {};
    }

    // Add Ship info to ShipTo Numbers list if not present
    const { mappedValue, shipToPresent } = mapShipToValuesFromQuote(populated.shipToNumbers, quoteValues);
    if (!shipToPresent) {
        populated.shipToNumbers = [ mappedValue, ...populated.shipToNumbers];
    }
    return {
        [FORM_FIELD_LABELS.quoteNumber]: quoteNumber,
        ...{
            ...quoteValues,
            [FORM_FIELD_LABELS.shipToNumber]: mappedValue,
        }
    }
}