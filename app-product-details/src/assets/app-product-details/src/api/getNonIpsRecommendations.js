import axios, { POST } from './axios';
import getSessionUser from './getSessionUser';
import { l } from '@insight/toolkit-utils';
import { getThirdPartyWarranties } from './getThirdPartyWarranties';
import { formatToProtectionPlan } from '../lib/warranties';
import { getRequestForRecommendationsApi } from './getRequestForRecommendationsApi';

export const getNonIpsRecommendations = async (productId, byPassError,salesOrg) => {
    try {
        const {
            userInformation,
            isLoggedIn: loggedin,
          } = await getSessionUser();
          const {
            currencyCode,
          } = userInformation || {};
         const placementids = `item_page.rr_warranties|item_page.rr_accessories|item_page.rr2_recommends|item_page.rr2_recommends_qa|item_page.rr3_recommends`
         const locale = l();
          const body = await getRequestForRecommendationsApi(placementids,productId,false)
        let url = '/gapi/product-management/getRecommendations'
        const { data } = await axios({
          method: POST,
          url: url,
          data: body,
        })
        // Extensive checks due to having to reduce the response
        if (!Array.isArray(data) || !data.length) {
          if (byPassError) return {}
          throw new Error('Error finding placements')
        }
        // Reduce recommendations array to object
        const recommendationsArray = data?.reduce(
          (obj, cur) => ({
            ...obj,
            [cur.placementId]: cur,
          }),
          {}
        )

        // Get 3rd party warranties only for US for now
        let isUSLocale = locale && locale.split('_')[1] === 'US';
        if (loggedin) {
          isUSLocale = isUSLocale && currencyCode === 'USD';
        }
        const thirdPartyList = isUSLocale
          ? await getThirdPartyWarranties(productId, salesOrg)
          : [];
        const thirdPartyProtection = thirdPartyList?.length ? thirdPartyList?.map(formatToProtectionPlan) : thirdPartyList;

        // Return recommendations object
        const recommendationsData = {
          accessories: recommendationsArray['item_page.rr_accessories'],
          protection: recommendationsArray['item_page.rr_warranties'],
          thirdPartyProtection,
          better_together:
            recommendationsArray['item_page.rr2_recommends'] ||
            recommendationsArray['item_page.rr2_recommends_qa'],
          bought_together: recommendationsArray['item_page.rr3_recommends'],
        }
        return recommendationsData
    } catch (err) {
      if (err.response?.data?.message) err = new Error(err.response.data.message)
      console.warn(`Failed to fetch placements`, err)
      throw err
    }
}