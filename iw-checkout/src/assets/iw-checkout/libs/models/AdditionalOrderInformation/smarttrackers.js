import {get, post} from '../fetch';

/**
 * fetch current user's header level smartTracker
 * @return {[type]} [description]
 */
export function fetchSmartTrackers() {
    const timestamp = (new Date()).getTime()
    return get(`smarttrackers?_=${timestamp}`)
        .catch((error) => {
            throw error // re-throw error for initial testing of functionality
        })
}

export function saveHeaderLevelSmartTrackerDefaults(smartTrackers) {
    return post('smarttrackerdefaults', smartTrackers, {json: false})
        .then(response => {
            if (response.ok) {
                return smartTrackers;
            }
        })
        .catch((error) => {
            console.warn(`Failed to save order metadata : ${JSON.stringify(smartTrackers)}`);
            throw error;
        });
}

export function fetchPopulateUIFlags() {
    const timestamp = (new Date()).getTime()
    return get(`populateUIFlags?_=${timestamp}`)
        .catch((error) => {
            throw error // re-throw error for initial testing of functionality
        })
}

export function saveAdditionalOrderInformation(payload) {
    return post('shoppingRequest/orderMetaData', payload)
        .catch((error) => {
            console.warn(`Failed to save order metadata : ${JSON.stringify(payload)}`)
            throw error
        })
}
