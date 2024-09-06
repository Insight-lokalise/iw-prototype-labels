import React, { Fragment, useContext } from 'react'
import { Breadcrumbs, connectToLocale, TextView } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'
import { CompareProvider } from './../context/CompareContext'
import { SearchPage } from './SearchPage'
import { SearchCompare } from './SearchCompare/SearchCompare'
import SearchNotFound from './SearchNotFound/SearchNotFound'
import { SearchContext } from './../context/SearchContext'
import { hideHeroImageBanner } from '../shared/hideHeroImage'

function SearchPageWrapper({ context, landingPageInfo }){
  const { noResultsFound, origParams } = useContext(SearchContext)
  const queryString = window.location.search
  const params = new URLSearchParams(queryString)
  const query = params.get('q')
  const { salesOrg, contract, isLoggedIn, isIPSUser } = context

  // Set default view to search page
  let view = (
    <CompareProvider>
      <SearchPage landingPageInfo={landingPageInfo} salesOrg={salesOrg} contract={contract}/>
      <SearchCompare isLoggedIn={isLoggedIn} isIPSUser={isIPSUser} />
    </CompareProvider>
  )
  // need to hide hero image banner on category pages
  if (origParams?.searchType === 'category') {
    hideHeroImageBanner()
  }
  // Set view to not found if no results found
  if (noResultsFound) view = <SearchNotFound query={query} />

  const renderBreadcrumbLabel = () => {
    if (noResultsFound) {
      return (
        <Fragment>
          {t('Search results')}: {query}
        </Fragment>
      )
    }
    return t('Search')
  }
  return (
    <div>
      <div className="o-wrapper">
        <Breadcrumbs>
          <Breadcrumbs.Item href="/">{t('Home')}</Breadcrumbs.Item>
          <Breadcrumbs.Item current>{renderBreadcrumbLabel()}</Breadcrumbs.Item>
        </Breadcrumbs>
      </div>
      {view}
    </div>
  )
}

export default connectToLocale(SearchPageWrapper)
