
import { getAccountInformation } from '../api';
import { getDefaultLoggedOutSalesOrg } from '@insight/toolkit-utils';

export const getSalesOrg = async () => {
    const {
      salesOrg: origSalesOrg,
      ipsUser,
      locale,
    } = await getAccountInformation();

    return origSalesOrg || getDefaultLoggedOutSalesOrg(locale, ipsUser);
}