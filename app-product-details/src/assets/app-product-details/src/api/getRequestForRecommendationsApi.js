import { addFieldsForHybridX } from 'app-api-user-service';
import { getDefaultLoggedOutSalesOrg } from '@insight/toolkit-utils';
import getSessionUser from './getSessionUser';
import { l } from '@insight/toolkit-utils';

export const getRequestForRecommendationsApi = async (placementIds, productId, isIpsUser) => {
    const {
      userInformation,
      sessionId,
      isLoggedIn: loggedin,
      isIpsLogo,
    } = await getSessionUser();
  
    const {
      salesOrg,
      currencyCode,
      webLoginProfileId,
      isCES: ces,
      webGroup: { webGroupId } = {},
      account: { soldToId } = {},
      defConsortiaId: consortiaId,
    } = userInformation || {};
  
    const locale = l();
    const request = {
      locale,
      salesOrg: salesOrg || getDefaultLoggedOutSalesOrg(locale, isIpsLogo),
      currencyCode,
      sessionId,
      placementIds,
      ...(productId && { productId }),
      ...((loggedin && soldToId && webGroupId) && {
        soldTo: soldToId,
        webGroup: webGroupId,
        userId: webLoginProfileId
      }),
      ...(consortiaId && {consortiaId})
    }
    if (isIpsUser) {
      request.returnPrice = 'async'
    }
    await addFieldsForHybridX({ isLoggedIn: loggedin, isCES: ces }, request)
    return request
  }