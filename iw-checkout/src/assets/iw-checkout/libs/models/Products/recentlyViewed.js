import { post } from '../fetch';
import { currentLocale } from '../User/locale';
import axios, { POST } from '../../../app/libs/axiosConfig';
import { getDefaultLoggedOutSalesOrg } from '@insight/toolkit-utils';
import { isCesOrDefaultLoggedOut } from '../../../app/libs/helpers/cesOrDefaultLoggedOut';

/**
 * Reads a list of recently viewed Product materialIds from the cookie 'recent_views'
 * @return {Array} Product materialIds that have been recently viewed
 */
export function getRecentlyViewedMaterialIds() {
    let recentViews = [];
    try {
        // Soon override with InsightStorage.get('recent_views', { cookie: true }) || storage.getCookie();
        const recentViewsCookie = $.cookie('recent_views', { path: '/' });
        if (recentViewsCookie) {
            recentViews = JSON.parse(
                decodeURIComponent(recentViewsCookie)
            ).recentViews;
        }
    } catch (e) {
        $.removeCookie('recent_views', { path: '/' });
    }

    return recentViews;
}

/**
 * Fetch Recently viwed items for Legacy
 */
function fetchRecentlyViewedItemsForLegacy() {
    const body = Object.assign({}, _productSuggestionRequestTemplate, {
        locale: currentLocale(),
        materialIds: getRecentlyViewedMaterialIds(),
    })
    return post('compareProducts', body).catch((error) => {
        console.warn('Failed to fetch cart: ', error);
    })
}

/**
 * Get Request for Recently Viewed API CES Api call
 */
const getRequestForRecentlyViewedCesApi = (materialIds) => {
    const { userInformation, isIpsLogo } = window.Insight;
    const locale = currentLocale();
    const {
        webGroupId,
        currencyCode,
        soldto: soldTo,
        salesOrg: origSalesOrg,
        defConsortiaId,
    } = userInformation || {};
    const salesOrg = origSalesOrg || getDefaultLoggedOutSalesOrg(locale, isIpsLogo);

    return {
        locale,
        salesOrg,
        materialIds,
        currencyCode,
        includeVariants: false,
        includeSpecifications: false,
        ...((soldTo && webGroupId) && {
            soldTo,
            webGroup: webGroupId
        }),
        ...((defConsortiaId) && {
            consortiaId: defConsortiaId
        }),
    }
}

/**
 * Fetch Recently viwed items for CES and Default Logged out
 */
async function fetchRecentlyViewedItemsForCES() {
    try {
        // Get material ids for the selected products
        const materialsIds = getRecentlyViewedMaterialIds() || [];
        const body = getRequestForRecentlyViewedCesApi(materialsIds);

        const { data } = await axios({
            method: POST,
            url: '/gapi/product-management/products',
            data: body,
        })
        if (!data) console.warn('Error finding products data');
        return data;
    } catch (err) {
        if (err.response?.data?.message) err = new Error(err.response.data.message);
        console.warn(`Failed to fetch products data`, err);
    }
}

/**
 * Fetch Recently Viewed Items
 * Check CES, Default logged out and Legacy to call appropriate function
 */
export function fetchRecentlyViewedItems() {
    const isCESOrDefaultLoggedOut = isCesOrDefaultLoggedOut();
    return isCESOrDefaultLoggedOut ? fetchRecentlyViewedItemsForCES() : fetchRecentlyViewedItemsForLegacy();
}

const _productSuggestionRequestTemplate = {
    showSuggestedSearch: false,
    searchOpenMarket: false,
    showApprovedItemOnlyLink: false,
    showProductCompare: false,
    showProductCenterLink: false,
    catalogData: {
        customCatalogId: null,
        overrideCatalogId: null,
        approvedItemsCatalogId: null,
        purchasableCatalogSet: null,
        filterManufacturerCatalogId: null,
    },
    fromClp: false,
    salesOffice: '2001',
    salesOrg: '2400',
    defaultPlant: '10',
    onlyOpenMarket: false,
    pageSize: 0,
    pageNumber: 0,
    fieldList: [],
    sort: 'BestSellers',
    rebateSearch: false,
    defaultSort: true,
    useBreadcrumb: false,
    secure: false,
    displayOpenMarket: false,
}