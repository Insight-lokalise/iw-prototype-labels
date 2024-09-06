import React, {useContext, useEffect, useState} from 'react'
import PDPContext from './pdp'
import { usePlacements } from 'app-api-user-service'
import { getSessionUser } from '../api/getSessionUser';
import { getNonIpsRecommendations } from '../api/getNonIpsRecommendations';
import { getRequestForRecommendationsApi } from '../api/getRequestForRecommendationsApi';
import {SSE} from "sse.js";

/** Placements Context */
export const PlacementsContext = React.createContext({
  accessories: null,
  protection: null,
  better_together: null,
  bought_together: null,
})
PlacementsContext.displayName = 'Placements'

/** Placements Context Provider
 *
 * Renders a provider containing the current state of protection, accessories and better together
 * */
export const PlacementsProvider = (props) => {
  const { contract, locale, salesOrg } = props.context
  const {
    product = {},
  } = useContext(PDPContext)

  const placements = {
    bought_together: 'item_page.rr3_recommends',
    accessories: 'item_page.rr_accessories',
    protection: 'item_page.rr_warranties',
  }

  const onRecommendationsInfo = (data) => {
    data.thirdPartyProtection = []
    data.better_together = {}
  }

  const {
    recommendations,
    recommendationsPrices,
    recommendationsSSEComplete,
    recommendationsSSEError
  } = usePlacements({
    placements,
    productId: product?.materialId,
    byPassError: false,
    contract,
    product,
    salesOrg,
    getSessionUser,
    getNonIpsRecommendations,
    getRequestForRecommendationsApi,
    onRecommendationsInfo,
    useEffect,
    useState,
    SSE,
  })

  return (
    <PlacementsContext.Provider value={{ ...recommendations, recommendationsPrices, recommendationsSSEComplete, recommendationsSSEError }}>
      {props.children}
    </PlacementsContext.Provider>
  )
}

export default PlacementsContext
