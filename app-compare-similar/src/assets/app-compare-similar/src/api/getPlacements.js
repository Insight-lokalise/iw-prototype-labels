import axios, { POST } from './axios';
import { l } from '@insight/toolkit-utils';
import { getSessionUser } from './getSessionUser';
import { getThirdPartyWarranties } from './getThirdPartyWarranties';
import { getDefaultLoggedOutSalesOrg } from '@insight/toolkit-utils'; 
import { formatToProtectionPlan } from '../../lib/warranties';
import { addFieldsForHybridX } from 'app-api-user-service'

/** Get Placements API
 *
 * Get product placements using the provided options
 * @param {string} productId - Unique product/material id
 *
 * @returns {array} array of placements
 */

export const getPlacements = async (productId) => {
  try {
    const {
      userInformation,
      isLoggedIn: loggedin,
      isIpsLogo,
      sessionId,
    } = await getSessionUser()
    const { 
      salesOrg : userSalesOrg, 
      currencyCode, 
      isCES, 
      webGroup: { webGroupId } = {},
      account: { soldToId } = {}, 
      webLoginProfileId, 
      defConsortiaId: consortiaId 
    } = userInformation || {}
    const locale = l()
    const params = {}
    const salesOrg = userSalesOrg || getDefaultLoggedOutSalesOrg(locale, isIpsLogo);
    
    let body = {
      locale,
      salesOrg,
      currencyCode,
      sessionId,
      productId,
      placementIds: `item_page.rr_warranties|item_page.rr_accessories|item_page.rr2_recommends|item_page.rr2_recommends_qa|item_page.rr3_recommends`,
      ...params,
      ...((loggedin && soldToId && webGroupId) && {
        soldTo: soldToId,
        webGroup: webGroupId,
        userId: webLoginProfileId
      }),
      ...(consortiaId && {consortiaId})
    }

    await addFieldsForHybridX({isLoggedIn: loggedin, isCES}, body)
    const { data } = await axios({
      method: POST,
      url: '/gapi/product-management/getRecommendations',
      data: body
    })
    // Extensive checks due to having to reduce the response
    if ((!data || !Array.isArray(data), !data.length)) {
      throw new Error('Error finding placements')
    }
    // Reduce placements array to object
    const placements = data?.reduce(
      (obj, cur) => ({
        ...obj,
        [cur.placementId]: cur,
      }),
      {}
    )

    // Get 3rd party warranties only for US for now
    let isUSLocale = locale?.split('_')?.[1] === 'US';
    if (loggedin) {
      isUSLocale = isUSLocale && currencyCode === 'USD';
    }
    const thirdPartyList = isUSLocale
      ? await getThirdPartyWarranties(productId, salesOrg)
      : [];
    const thirdPartyProtection = thirdPartyList?.length ? thirdPartyList?.map(formatToProtectionPlan) : thirdPartyList;

    // Return placements object
    return {
      accessories: placements['item_page.rr_accessories'],
      protection: placements['item_page.rr_warranties'],
      thirdPartyProtection,
      better_together:
        placements['item_page.rr2_recommends'] ||
        placements['item_page.rr2_recommends_qa'],
      bought_together: placements['item_page.rr3_recommends'],
    }
  } catch (err) {
    if (err.response?.data?.message) err = new Error(err.response.data.message)
    console.warn(`Failed to fetch placements`, err)
    throw err
  }
}

export default {
  getPlacements,
}
