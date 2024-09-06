import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { CompareSimilarPage } from './components/CompareSimilarPage'
import { RecommendationsProvider } from './context/RecommendationsContext'

export const RouteComponent = () => (
  <BrowserRouter basename="/insightweb/product-compare">
    <RecommendationsProvider>
      <CompareSimilarPage />
    </RecommendationsProvider>
  </BrowserRouter>
)

export default RouteComponent
