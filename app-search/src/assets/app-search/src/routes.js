import React from 'react'
import { SearchProvider } from './context/SearchContext'
import { RecommendationsProvider } from './context/RecommendationsContext'
import SearchPageWrapper from './components/SearchPageWrapper'

export default function WrapperComponent({ landingPageInfo }) {
  return (
    <SearchProvider>
      <RecommendationsProvider>
        <SearchPageWrapper landingPageInfo={landingPageInfo} />
      </RecommendationsProvider>
    </SearchProvider>
  )
}