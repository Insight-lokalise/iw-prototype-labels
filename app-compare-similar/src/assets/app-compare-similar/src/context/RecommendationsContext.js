import React, { createContext, useState, useEffect } from 'react'
import { SSE } from 'sse.js'
import {getThirdPartyWarranties} from '../api/getThirdPartyWarranties'
import getSessionUser from "../api/getSessionUser";
import { usePlacements } from 'app-api-user-service'

/** Recommendations Context
 * Used to store the recommendation state */
export const RecommendationsContext = createContext({})

/**  Recommendations Context Provider
 *
 * Renders the current state of recommended products
 * */
export const RecommendationsProvider = ({ children }) => {

  const placements= {
    accessories: 'item_page.rr_accessories',
    protection: 'item_page.rr_warranties'
  }

  const [selectedContract, setSelectedContract] = useState(null)

  const {
    getRecommendationData,
    recommendationsSSEError: richRelevanceSSEError,
    recommendationsSSEComplete: richRelevanceSSEComplete,
    recommendationsPrices: priceInfo
  } = usePlacements({
    placements,
    runOnInit: false,
    getSessionUser,
    useEffect,
    useState,
    SSE,
  })

  const _getThirdPartyWarranties = async (materialId, salesOrg, currency, locale, ipsUser, selectedContractId) => {
    const isUSLocale = locale && locale.split('_')[1] === 'US' && currency === 'USD'
    //Get 3rd party warranties only for US for now
    const thirdPartyWarranties = await getThirdPartyWarranties(materialId, salesOrg, ipsUser, selectedContractId)
    return isUSLocale
      ? thirdPartyWarranties
      : []
  }

  const prepareRecommendationData = async (payload) => {
    const { selectedContractId, ipsUser, ...others } = payload
    const { materialId, locale, salesOrg, currency, contractId } = others
    const [ thirdPartyProtection, recommendationResponse ] =
      await Promise.all([
        _getThirdPartyWarranties(materialId, salesOrg, currency, locale, ipsUser, selectedContractId),
        getRecommendationData(materialId, {contractId}, ipsUser, others)
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

    return recommendationInfo;
  }

  return (
    <RecommendationsContext.Provider
      value={{
        prepareRecommendationData,
        RRPriceInfo: priceInfo,
        richRelevanceSSEComplete,
        richRelevanceSSEError,
        setContract: setSelectedContract,
        selectedContract
      }}
    >
      {children}
    </RecommendationsContext.Provider>
  )
}
