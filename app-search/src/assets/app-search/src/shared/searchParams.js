const DEFAULT_PARAMS = [
    'country',
    'q',
    'salesOrg',
    'lang',
    'tabType',
    'sessionId',
    'userSegment',
    'locale',
    'category',
    'pq',
    'qsrc',
    'qtype',
    'searchType',
    'licenseContractIds',
    'selectedContractIDs'
];
const SELECTED_AND_RANGE_PARAMS = [ 'selectedFacet', 'rangeFacet'];
const EXCLUDED_PARAMS = [
    'userSegment',
    'userId',
    'sessionId',
    'soldTo',
    'webGroup',
];
const EXCLUDED_FROM_URL_PARAMS = [
  'fq'
]
const FACETS_KEYS = { tabType: 'tabType' };
const DEFAULT_PARAM_VALUES = { 'start': 0, 'rows': 50 };

export const getDefaultURLParams = (params, tabType) => {
    if (params && Object.keys(params).length > 0) {
        const defaultParams = {};
        Object.keys(params)?.forEach((paramKey) => {
            if (DEFAULT_PARAMS.includes(paramKey)) {
                const param = params[paramKey];
                defaultParams[paramKey] = DEFAULT_PARAM_VALUES[paramKey] || param;
            }
        });
        if (tabType) {
            defaultParams[FACETS_KEYS.tabType] = tabType;
        }
        return defaultParams;
    }
    return {};
}

// Get Updated Search Params
export const getUpdatedSearchParams = (origParams, key, value) => {
    const searchParams = new URLSearchParams();
    Object.keys(origParams).map((param) => {
        if ( SELECTED_AND_RANGE_PARAMS.includes(param) && Array.isArray(origParams[param]) ) {
          searchParams.set(param, origParams[param].join(','))
        } else {
          //We don't need to include the params (userSegment, userId, sessionId) as it is already included
          //in the getData.js axios GET url param. Otherwise, we risk duplicating URL parameters as raised in CES-1640
          if ( !EXCLUDED_PARAMS.includes(param) ) {
            searchParams.set(param, origParams[param])
          }
        }
    });
    searchParams.set(key, value);
    // reset page number when new request is not related to page and number of records
    // but we can still manually set start as 0 when needed
    if (!['start'].includes(key)) {
        searchParams.set('start', '0');
    }
    if (!value) {
        searchParams.delete(key);
    }
    return searchParams;
}

// Reset all the Search params in URL
export const resetSearchParams = (origParams) => {
    const searchParams = new URLSearchParams();
    Object.keys(origParams).map((param) => {
        if ( SELECTED_AND_RANGE_PARAMS.includes(param) ) {
            searchParams.delete(param)
        } else {
            searchParams.set(param, origParams[param])
        }
    });
    return searchParams;
}

export const updateQueryWithParams = (params) => {
    // updates page query parameters based on current state
    if ('URLSearchParams' in window && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams();
      Object.keys(params).forEach((param) => {
        if(!EXCLUDED_FROM_URL_PARAMS.includes(param)) {
          searchParams.set(param, params[param])
        }
      })
      const newPathQuery = window.location.pathname + '?' + searchParams.toString();
      history.replaceState(null, '', newPathQuery);
    }
}

export const getQueryParamsForContentTabs = (params, currentTabData) => {
    if(!params?.toString()) {
        return {};
    }
    const tabDataExists = currentTabData && Object.keys(currentTabData).length > 0 && !currentTabData?.isSearching;
    const { country, salesOrg, lang, userSegment, sessionId } = 
        tabDataExists ? currentTabData : Object.fromEntries(params);
    return {
        country,
        salesOrg,
        lang,
        userSegment,
        sessionId,
    }
}
