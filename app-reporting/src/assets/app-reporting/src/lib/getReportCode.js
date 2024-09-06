import { REPORTING_CODE_KEY } from '../constants';

export const getReportCode = (nameLink) => {
    if (nameLink) {
        const params = nameLink?.split?.('?')?.[1];
        if (params) {
            const urlParams = new URLSearchParams(params);
            return urlParams?.get(REPORTING_CODE_KEY);
        }
    }
    return null;
}