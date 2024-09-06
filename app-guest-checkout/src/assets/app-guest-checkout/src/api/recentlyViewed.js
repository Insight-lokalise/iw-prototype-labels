import axios, { POST } from './axiosConfig';
import { getAccountInformation } from './getData';
import { getDefaultLoggedOutSalesOrg } from '@insight/toolkit-utils';
import { getCookie, deleteCookie } from "@insight/toolkit-utils/lib/helpers/cookieHelpers";
/**
 * Reads a list of recently viewed Product materialIds from the cookie 'recent_views'
 * @return {Array} Product materialIds that have been recently viewed
 */
export const getRecentlyViewedMaterialIds = () => {
    let recentViews = { recentViews: [] };
     // retrieve material ids from cookie
    const recentViewsCookie = getCookie('recent_views');
    try {
        if (recentViewsCookie) {
            recentViews = JSON.parse(decodeURIComponent(recentViewsCookie));
            if (typeof (recentViews.recentViews) == 'undefined') {
                recentViews = { recentViews: [] };
            }
        }
    } catch (e) {
        deleteCookie('recent_views');
        console.warn('Error fetching material ids from cookie', e);
    }
    return recentViews.recentViews
  }

/**
 * Get Request for Recently Viewed Api call
 */
const getRequestForRecentlyViewed = async (materialIds) => {
    const {
        webGroupId,
        soldto: soldTo,
        ipsUser,
        locale,
        salesOrg: origSalesOrg,
        currencyCode
    } = await getAccountInformation();
    const salesOrg = origSalesOrg || getDefaultLoggedOutSalesOrg(locale, ipsUser);

    return {
        locale,
        materialIds,
        salesOrg,
        includeSpecifications: false,
        includeVariants: false,
        currencyCode,
        ...((soldTo && webGroupId) && {
            soldTo,
            webGroup: webGroupId
        }),
    }
}

/**
 * Fetch Recently Viewed Items
 */
export async function fetchRecentlyViewedItems( materialIds=[] ) {
    try {
        const body = await getRequestForRecentlyViewed(materialIds);
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