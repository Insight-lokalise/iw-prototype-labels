import React, { useContext, useCallback, Fragment } from 'react'
import { Button, connectToLocale } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'
import { Pagination, Message, Tooltip } from '@insight/toolkit-react'

import SearchControls from '../SearchControls/SearchControls'
import SearchFilter from '../SearchFilter/SearchFilter'
import SearchProducts from '../SearchProducts/SearchProducts'

import { SearchContext } from '../../context/SearchContext'
import { hideHeroImageBanner } from '../../shared/hideHeroImage'
import { NoResultsFoundWithFacets } from '../SearchNotFound/NoResultsFoundWithFacets'
import SearchNotFound from '../SearchNotFound/SearchNotFound'
import { splitFacets, containsSpaceOrDoubleQuote, escapeDoubleQuotes } from '../../shared/utils'
import {hasCookie, getCookie} from "@insight/toolkit-utils/lib/helpers/cookieHelpers";
import { IPS_PAGE_URL_COOKIE_NAME } from '../../constants'

export const ProductsTab = ({
  landingPageInfo,
  tabType,
  showFilters,
  setShowFilters,
  context
}) => {
  const {
    currency,
    contents,
    salesOrg,
    originalSpelling,
    correctedSpelling,
    instockOnly,
    products,
    searchSSEError,
    numFound: totalRecords,
    start,
    view,
    pages: totalPages,
    pageNumber: currentPage,
    facets,
    isSearching,
    error,
    searchProducts,
    originalFilters,
    selectedFilters,
    setFilter,
    clearFilters,
    origParams,
    outOfStockOnly,
  } = useContext(SearchContext)
  const { contract, isLoggedIn, isIPSUser } = context;
  const isSingleContract = isIPSUser && (isLoggedIn && contract?.contractName !== "All" || !isLoggedIn && !!contract)
  const ipsPageUrlCookie = hasCookie(IPS_PAGE_URL_COOKIE_NAME) ? getCookie(IPS_PAGE_URL_COOKIE_NAME): null
  const { isBrandPage, isLandingPage } = landingPageInfo
  const hasCategoryFilterApplied = !!origParams?.category
  const hasFacetFilterApplied = !!origParams?.selectedFacet
  const hasRangeFilterApplied = !!origParams?.rangeFacet
  const showProductNoResultPage = !(
    hasCategoryFilterApplied ||
    hasFacetFilterApplied ||
    hasRangeFilterApplied
  )

  const queryString = window.location.search
  const params = new URLSearchParams(queryString)

  const query = correctedSpelling ? correctedSpelling : params.get('q')
  // in case of Brand or Category search pages, there is a chance of having search term from legacy page query
  let queryToDisplay = query || origParams?.q

  // check for wildcard search keyword
  if (queryToDisplay === '*:*') {
    queryToDisplay = t('All products')
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  const onHandleClearAll = () => {
    if ('URLSearchParams' in window && Object.keys(origParams).length > 0) {
      const searchParams = new URLSearchParams()
      Object.keys(origParams).map((param) => {
        if (['selectedFacet', 'rangeFacet'].includes(param)) {
          searchParams.delete(param)
        } else {
          searchParams.set(param, origParams[param])
        }
      })
      // when clearing all filters, we always clear in stock only filter also
      searchParams.set('instockOnly', false)
      searchProducts(searchParams.toString(), contents, salesOrg, contract)
    }
    clearFilters()
  }

  const onPageChange = (page) => {
    searchHandler({ key: 'start', value: Number(origParams.rows) * (page - 1) })
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
  }

  const onInStockFilterChange = () => {
    searchHandler({ key: 'instockOnly', value: !instockOnly })
  }

  const onCategoryFilterChange = (category, clearGroup = false) => {
    const value = clearGroup ? '' : category.val
    searchHandler({ key: 'category', value })
  }

  const handleFilterChange = (filterType, option, clearGroup = false) => {
    const optionValue = option.val;
    // Note: LW expects quotes for regular facets with spaces and quotes to be wrapped in quotes, whereas same do not apply for Range facets
    // check string whether space and quote exists
    // if yes then wrap with quote
    // if no then return as it is
    const wrappedOptionValue =
      filterType == 'selectedFacet' && containsSpaceOrDoubleQuote(optionValue)
        ? `"${escapeDoubleQuotes(optionValue)}"`
        : optionValue
    const currentSelectedFacets = origParams[filterType]
    if (currentSelectedFacets) {
      const selectedFacetsMaps = {}
      // process this into map to easy manipulation
      const optionGroups = Array.isArray(currentSelectedFacets)
        ? currentSelectedFacets
        : splitFacets(currentSelectedFacets)
      optionGroups.map((optionGroup) => {
        const [groupName, values] = optionGroup.split(':')
        selectedFacetsMaps[groupName] = values.split('|')
      })
      // if clear group is enabled, we just need to clear the group
      if (option.group in selectedFacetsMaps && !clearGroup) {
        // found in params, then identify if value exists, if yes remove else add
        const valuesInGroup = selectedFacetsMaps[option.group]
        if (valuesInGroup.includes(wrappedOptionValue.toString())) {
          // remove
          selectedFacetsMaps[option.group] = valuesInGroup.filter(
            (val) => val != wrappedOptionValue
          )
        } else {
          // add
          selectedFacetsMaps[option.group] = [
            ...valuesInGroup,
            wrappedOptionValue,
          ]
        }
      } else {
        // not enter new key and value array
        selectedFacetsMaps[option.group] = [wrappedOptionValue]
      }

      // construct selectedFacets value
      let SelectedFacetsString = ''
      Object.keys(selectedFacetsMaps).map((groupName, index) => {
        if (selectedFacetsMaps[groupName].length > 0) {
          SelectedFacetsString += `${
            !!SelectedFacetsString ? ',' : ''
          }${groupName}:${selectedFacetsMaps[groupName].join('|')}`
        }
      })
      searchHandler({ key: filterType, value: SelectedFacetsString })
    } else {
      // has no selected facets add new one
      searchHandler({
        key: filterType,
        value: `${option.group}:${wrappedOptionValue}`,
      })
    }
    setFilter(option, clearGroup)
  }

  const onRangeFilterChange = (range, clearGroup) => {
    handleFilterChange('rangeFacet', range, clearGroup)
  }

  const OnFilterChange = (option, clearGroup) => {
    handleFilterChange('selectedFacet', option, clearGroup)
  }

  const searchHandler = ({ key, value }) => {
    // diff with searchProducts
    // add origParams and change as params and call searchProducts
    if ('URLSearchParams' in window && Object.keys(origParams).length > 0) {
      const searchParams = new URLSearchParams()
      Object.keys(origParams).map((param) => {
        if (
          ['selectedFacet', 'rangeFacet'].includes(param) &&
          Array.isArray(origParams[param])
        ) {
          searchParams.set(param, origParams[param].join(','))
        } else {
          //We don't need to include the params (userSegment, userId, sessionId) as it is already included
          //in the getData.js axios GET url param. Otherwise, we risk duplicating URL parameters as raised in CES-1640
          if (
            ![
              'userSegment',
              'userId',
              'sessionId',
              'soldTo',
              'webGroup',
            ].includes(param)
          ) {
            searchParams.set(param, origParams[param])
          }
        }
      })
      searchParams.set(key, value)
      // reset page number when new request is not related to page and number of records
      // but we can still manually set start as 0 when needed
      if (!['start'].includes(key)) {
        searchParams.set('start', '0')
      }
      if (!value && key != 'instockOnly') {
        searchParams.delete(key)
      }
      searchProducts(searchParams.toString(), contents, salesOrg, contract);
    }
  }

  if (origParams?.searchType === 'category') {
    hideHeroImageBanner()
  }

  const handleProductOnClick = useCallback((product, productUrl, position) => {
    let analyticsListName = 'Main Search'
    if (isBrandPage) {
      analyticsListName = 'Shop Partner'
    } else if (isLandingPage) {
      analyticsListName = 'Shop Category'
    }
  },[isBrandPage, isLandingPage])


  return showProductNoResultPage && !isSearching && !products?.length ? (<Fragment>
        {error &&
            <Message
                type='warning'
                children={t('It looks like we’ve encountered a technical issue. Please try your search again. The issue has been reported to our technical team.')}
                ariaLive='polite'
            />
        }
        <SearchNotFound query={queryToDisplay} isProductsTab={true} />
      </Fragment>

  ) : (
    <>
      {hasCategoryFilterApplied && (
        <div className="c-search-page__clear-category">
          <Button
            className="u-text-bold"
            color="inline-link"
            onClick={() => onCategoryFilterChange({}, true)}
          >
            {t('Search all categories instead')}
          </Button>
        </div>
      )}
      {(error || searchSSEError) &&
          <Message
            type='warning'
            children={t('It looks like we’ve encountered a technical issue. Please try your search again. The issue has been reported to our technical team.')}
            ariaLive='polite'
          />
      }
      <div className="o-grid">
        <div className="c-search-page__filters-container o-grid__item u-1/1 u-1/4@desktop">
          {!isLoggedIn && !!contract && (
            <div className='c-search-filter'>
              <Tooltip content={contract?.displayName}>
                <div className='c-cart-actions__contract-name u-margin-bot-tiny' style={{webkitBoxOrient:'vertical'}}>{contract?.displayName}</div>
              </Tooltip>
              <Button className="c-cart-actions__contract-change" color="link" href={ipsPageUrlCookie} size='small'>{t('Change contract')}</Button>
            </div>
          )}
          <SearchFilter
            selectedFilters={selectedFilters}
            setFilter={OnFilterChange}
            setCategory={onCategoryFilterChange}
            setRange={onRangeFilterChange}
            showFilters={showFilters}
            toggleFilters={toggleFilters}
            instockOnly={instockOnly}
            outOfStockOnly={outOfStockOnly}
            facets={facets}
            setStockFilter={onInStockFilterChange}
          />
        </div>
        <div className="c-search-page__products-container o-grid__item u-1/1 u-3/4@desktop">
          <SearchControls
            clearFilters={onHandleClearAll}
            correctedSpelling={correctedSpelling}
            currentPage={currentPage}
            originalSpelling={originalSpelling}
            query={queryToDisplay}
            originalFilters={originalFilters}
            searchHandler={searchHandler}
            setFilter={OnFilterChange}
            setRange={onRangeFilterChange}
            setStockFilter={onInStockFilterChange}
            start={start}
            toggleFilters={toggleFilters}
            totalRecords={totalRecords}
          />
          {(!isSearching && !products?.length || searchSSEError) ? (
            <NoResultsFoundWithFacets clearFilters={onHandleClearAll} />
          ) : (
            <SearchProducts
              currency={currency}
              view={view}
              products={products}
              loading={isSearching}
              onHandleProductOnClick={handleProductOnClick}
              currentPage={currentPage}
            />
          )}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageHandler={onPageChange}
        />
      </div>
    </>
  )
}

export default connectToLocale(ProductsTab)
