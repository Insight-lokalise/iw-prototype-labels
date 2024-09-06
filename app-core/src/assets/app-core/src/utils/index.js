import { gigyaDataLogging } from "api";

export const GIGYA_KEYS = {
    GAC: 'gac_',
    GLT: 'glt_',
    UID: 'UID',
    LOG_DATA: 'gigyaDataLogged',
    LOG_TYPE: 'gigya',
}

export function getCookieByName(cookieName) {
    let cookieVal = document.cookie
    .split(';')
    .map(untrimmedCookie => decodeURIComponent(untrimmedCookie).trim())
    .find((item) => item.includes(cookieName));
    cookieVal = cookieVal && cookieVal.split('=') && cookieVal.split('=')[1];
    return cookieVal;
}

export const setToLocalStorage = (key, value) => localStorage.setItem(key, value);
export const getFromLocalStorage = (key) => localStorage.getItem(key);
export const removeFromLocalStorage = (key) => localStorage.removeItem(key);

export const logGigyaData = async () => {
    try {
        const gac = getFromLocalStorage(GIGYA_KEYS.GAC) || '';
        const glt = getCookieByName(GIGYA_KEYS.GLT) || '';
        const cdmUidWebSdk = getFromLocalStorage(GIGYA_KEYS.UID) || '';
        const data = {
            type: GIGYA_KEYS.LOG_TYPE,
            data: {
                gac,
                glt,
                cdmUid: cdmUidWebSdk,
                cdmUidWebSdk,
                timestamp: new Date().toUTCString(),
            }
        };  
        const onSuccess = () => {
            setToLocalStorage(GIGYA_KEYS.LOG_DATA, true);
            removeFromLocalStorage(GIGYA_KEYS.GAC);
            removeFromLocalStorage(GIGYA_KEYS.UID);
        }

        await gigyaDataLogging({ data, onSuccess });
    } catch (error) {
        console.error('------- Error invoking Gigya Logging API -------', error)
    }
}