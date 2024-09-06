import React, { useEffect, useState } from 'react'
import axios, { POST } from './axiosConfig';
import { l, getDefaultLoggedOutSalesOrg } from '@insight/toolkit-utils';
import { SSE } from 'sse.js'
import { getSessionUser } from '../api';
import { addFieldsForHybridX, usePlacements } from 'app-api-user-service'

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
    UserType: userType,
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
  await addFieldsForHybridX({ isLoggedIn: loggedin, isCES: ces }, request, { userType })
  return request
}

const getNonIpsRecommendations = async () => {
  const url = '/gapi/product-management/getRecommendations';
  const placementIds = `error_page.TopProducts_Redirect|error_page.CrossSell_Redirect`;
  const body = await getRequestForRecommendationsApi(placementIds);

  const { data } = await axios({
    method: POST,
    url,
    data: body,
  })
  // Extensive checks due to having to reduce the response
  if ((!data || !Array.isArray(data) || !data.length)) {
    throw new Error('Error finding placements')
  }
  // Reduce placements array to object
  const recommendationsArray = data?.reduce(
    (obj, cur) => ({
      ...obj,
      [cur.placementId]: cur,
    }),
    {}
  )
  // Return placements object
  const recommendationsData = {
    popular: recommendationsArray['error_page.TopProducts_Redirect'],
    recommended: recommendationsArray['error_page.CrossSell_Redirect'],
  }
  return recommendationsData;
}

export const getPlacements = (contract, isIPSUser) => {
  const placements = {
    popular: 'error_page.TopProducts_Redirect',
    recommended: 'error_page.CrossSell_Redirect',
  }
  const {
    recommendations,
    recommendationsSSEError,
    recommendationsSSEComplete,
    recommendationsPrices
  } = usePlacements({
    placements,
    contract,
    getSessionUser,
    getRequestForRecommendationsApi,
    getNonIpsRecommendations,
    useEffect,
    useState,
    SSE,
  })

  return { recommendations, recommendationsSSEError, recommendationsSSEComplete, recommendationsPrices }
}

