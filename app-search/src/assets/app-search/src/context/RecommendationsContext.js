import React, {createContext, useEffect, useMemo, useState} from 'react'
import { SSE } from 'sse.js'

import {getRequestForRecommendationsApi, getSessionUser, getThirdPartyWarranties} from '../api'
import { usePlacements } from 'app-api-user-service'

/** Recommendations Context
 * Used to store the recommendation state */
export const RecommendationsContext = createContext({})

/**  Recommendations Context Provider
 *
 * Renders the current state of recommended products
 * */
export const RecommendationsProvider = ({ children }) => {

  const placements = {
    accessories: 'add_to_cart_page.rr_accessories',
    protection: 'add_to_cart_page.rr_warranties',
  }

  const {
    getRecommendationData,
    recommendationsSSEError: richRelevanceSSEError,
    recommendationsSSEComplete: richRelevanceSSEComplete
  } = usePlacements({
    placements,
    runOnInit: false,
    getRequestForRecommendationsApi,
    getSessionUser,
    useEffect,
    useState,
    SSE,
  })

  const _getThirdPartyWarranties = async (materialId, salesOrg, contract, currency, locale) => {
    const isUSLocale = locale && locale.split('_')[1] === 'US' && currency === 'USD'
    //Get 3rd party warranties only for US for now
    const thirdPartyWarranties = await getThirdPartyWarranties(materialId, salesOrg, contract)
    return isUSLocale
      ? thirdPartyWarranties
      : []
  }

  const prepareRecommendationData = async (materialId, locale, salesOrg, currency, contract) => {
    const [ thirdPartyProtection, recommendationResponse ] =
      await Promise.all([
        _getThirdPartyWarranties(materialId, salesOrg, contract, currency, locale),
        getRecommendationData(materialId, contract)
      ])

    const { recommendationInfo = {} } = recommendationResponse
    const { accessories, protection } = recommendationInfo
    recommendationInfo.hasAccessories = accessories?.prodList?.length > 0
    recommendationInfo.warrantyMaterialIds =
      protection?.prodList?.map((prod) => prod?.materialId) || []
    recommendationInfo.thirdPartyWarrantyIds =
      (thirdPartyProtection &&
        thirdPartyProtection.map((warranty) => warranty?.materialId)) ||
      []
    recommendationInfo.thirdPartyProtection = thirdPartyProtection

    return recommendationResponse;
  }

  return (
    <RecommendationsContext.Provider
      value={{
        prepareRecommendationData,
        richRelevanceSSEComplete,
        richRelevanceSSEError
      }}
    >
      {children}
    </RecommendationsContext.Provider>
  )
}
