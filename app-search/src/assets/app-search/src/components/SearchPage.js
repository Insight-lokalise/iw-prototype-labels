import React, { useEffect, useState, useContext, useMemo } from 'react'
import { t, throttle } from '@insight/toolkit-utils'

import ProductsTab from './ProductsTab/ProductsTab'

import { SearchContext } from './../context/SearchContext'
import { hideHeroImageBanner } from './../shared/hideHeroImage'
import { CONTENTMAP, DEFAULT_PAGE_COUNT, INSIGHT_CURRENT_LOCALE_COOKIE_NAME, FF_SOLUTIONS_SEARCH } from '../constants'
import { getCurrentLocale } from '@insight/toolkit-utils/lib/helpers'
import BrandsTab from './BrandsTab/BrandsTab'
import ArticlesTab from './ArticlesTab/ArticlesTab'
import SolutionsTab from './SolutionsTab/SolutionsTab'
import SolutionsAndServicesTab from './SolutionsAndServicesTab'
import SearchTabs from './SearchTabs/SearchTabs'
import SearchContentTile from './SearchContentTile'
import { getDefaultURLParams, getQueryParamsForContentTabs, updateQueryWithParams } from '../shared/searchParams'



export const SearchPage = ({ landingPageInfo, salesOrg, contract }) => {
  const {
    correctedSpelling,
    numFound: totalRecords,
    contents,
    searchProducts,
    searchBrands,
    searchArticles,
    searchSolutions,
    searchSolutionsAndServices,
    searchDocs,
    docs,
    origParams: origParamsContext,
    origFacetDisplays,
    dispatch,
    tabType,
    setTabtype,
    contentData
  } = useContext(SearchContext);
 const contractName = contract?.contractType
  let queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  const currentTabData = contentData?.[tabType] || {};
  const isSolutionsServicesTab = tabType === CONTENTMAP.solutionsAndServices.id; 

  let origParams = origParamsContext;
  if (isSolutionsServicesTab) {
    origParams = contentData?.[tabType]?.origParams || origParamsContext;
  }
  origParams = origParams || {};
  
  const getUrlQueryParams = () => {
    return !!Object.keys(origParams).length ?
      {
        ...origParams,
        // Add Query params from context for Content tabs
        ...(isSolutionsServicesTab && getQueryParamsForContentTabs(params, currentTabData)),
        tabType: tabType
      } : (
        // When origParams is not available (for e.g. when search api is not working), use Default params.
        // Otherwise params would be removed from URL
        getDefaultURLParams(Object.fromEntries(params), tabType) || {}
      );
  }
  const urlQueryParams = getUrlQueryParams();

  const { initQuery, isBrandPage, isLandingPage, productSet,transformQuery } = landingPageInfo
  const hasCategoryFilterApplied = origParams?.category
  let searchText = ''
  const categoryName =
    hasCategoryFilterApplied &&
    (origFacetDisplays?.category_code_hier?.[0]?.label || origParams?.category)
  const locale = getCurrentLocale(INSIGHT_CURRENT_LOCALE_COOKIE_NAME)
  const country = locale?.split('_')?.[1]
  if (params.has('lang')) {
    params.set('lang', locale === 'en_CA' ? 'en_US' : locale)
    params.set('locale', locale)
  }
  queryString = params.toString();
  const [showFilters, setShowFilters] = useState(false);
  const query = correctedSpelling ? correctedSpelling : params.get('q');
  // in case of Brand or Category search pages, there is a chance of having search term from legacy page query
  let queryToDisplay = query || origParams?.q;

  if (queryToDisplay) {
      searchText = queryToDisplay
  }
  // check for wildcard search keyword
  if (queryToDisplay === '*:*') {
    queryToDisplay = t('All products')
  }

  const tabClickHandler = (tab) => {
    setTabtype(tab.id);
    updateQueryWithParams({ ...urlQueryParams, tabType: tab?.id });
  }

  const findTabIndex = (tab) => tab.id === tabType;

  const getQueryStringForTabs = (isTab, tabType) => {
    return isTab ?
      queryString :
      getDefaultURLParams(Object.fromEntries(params), tabType)
  }

  const initialLoadData = async () => {
    const contentRequest = {
      searchText: searchText,
      pageSize: DEFAULT_PAGE_COUNT,
      currentPage: 1,
      salesOrg
    }

    const brandsContent = await searchBrands(contentRequest);
    const displaySolutionsAndServicesTab =  window?.flags?.[FF_SOLUTIONS_SEARCH]

    if (displaySolutionsAndServicesTab) {
      const solutionsTab = CONTENTMAP.solutionsAndServices.id;
      const solutionsAndServicesRequest = {
        queryString: getQueryStringForTabs(params.get('tabType') === solutionsTab, solutionsTab),
        tabType: solutionsTab
      }
      const solutionsAndServices = await searchSolutionsAndServices(solutionsAndServicesRequest)
      dispatch({
        type: 'FETCH_CONTENTS',
        payload: {
          brands: brandsContent,
          solutionsAndServices: solutionsAndServices,
        },
      })
    } else {
      const articlesContent = await searchArticles(contentRequest)
      const solutionsContent = await searchSolutions(contentRequest)
      dispatch({
        type: 'FETCH_CONTENTS',
        payload: {
          brands: brandsContent,
          articles: articlesContent,
          solutions: solutionsContent,
        },
      })
    }

    await searchDocs(contentRequest)
  }

  useEffect(() => {
    if(searchText != '') {
      initialLoadData()
    }
  }, [searchText]);


  useEffect(() => {
    if (isLandingPage) {
      // if user is coming from content landing page
      // read init query or page query and parse it down to lucid query
      // this will be URL from content page links
      const queryStringFromURL = window.location.search
      const landingPageQueryParams = new URLSearchParams(queryStringFromURL)
      if (queryStringFromURL && !landingPageQueryParams.has('pq')) {
        // This is a scenario where URL has been updated with LW query parameters, so no need to parse
        // even if it is not parsed, only possible query param is "q" and it is same between both legacy and LW
        searchProducts(queryString, contents, salesOrg, contract)
      } else {
        // this will be initial query from search component in AEM
        const queryStringFromComponent = !!initQuery
          ? new URL(initQuery).search
          : ''
        // Identified a special case where category pages are populated with product set attribute
        // with no page query or init query, check if query and init query are empty then look for product set
        if (queryStringFromURL || queryStringFromComponent) {
          const legacyToLWQuery = processLegacyQuery(
            queryStringFromURL || queryStringFromComponent,
            isBrandPage,transformQuery
          )
          searchProducts(legacyToLWQuery.toString(), contents, salesOrg, contract)
        } else if (productSet) {
          // look for product set
          searchProducts(
            `category=${productSet}&searchType=category`,
            contents,
            salesOrg,
            contract
          )
        } else {
          // default query with no params
          searchProducts(queryString, contents, salesOrg, contract)
        }
      }
    } else {
      const productsTab = CONTENTMAP.products.id;
      const requestQuery = getQueryStringForTabs(params.get('tabType') === productsTab, productsTab);
      // uses query parameter from page and invoke search
      searchProducts(requestQuery, contents, salesOrg, contract);
    }

    // Prevent overflow on body
    if (showFilters)
      document.documentElement.classList?.add('overflow-y-hidden')
    else document.documentElement.classList?.remove('overflow-y-hidden')

    // event listener for popstate to support browser back button
    const onHistoryPop = throttle(() => {
      searchProducts(window.location.search)
    }, 250)
    window.addEventListener('popstate', onHistoryPop)
    return () => {
      window.removeEventListener('popstate', onHistoryPop)
    }
  }, [showFilters])

  const tabs = useMemo(() => {
    let tabs = [
      {
        content: (
          <ProductsTab
            landingPageInfo={landingPageInfo}
            tabType={tabType}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
          />
        ),
        disabled: false,
        id: CONTENTMAP.products.id,
        name: `${t(CONTENTMAP.products.name)} (${totalRecords})`,
      },
    ]

    if (Object.keys(contents).length > 0) {
      const brandsTab = {
        content: (
          <div>
            <BrandsTab
              handleTabClick={searchBrands}
              query={queryToDisplay}
              id={CONTENTMAP.brands.id}
              items={contents[CONTENTMAP.brands.id] || {}}
              country={country}
            />
          </div>
        ),
        disabled: false,
        id: CONTENTMAP.brands.id,
        name: `${t(CONTENTMAP.brands.name)} (${
          contents[CONTENTMAP.brands.id]?.total
        })`,
      }
      const articlesTab = {
        content: (
          <div>
            <ArticlesTab
              handleTabClick={searchArticles}
              query={queryToDisplay}
              id={CONTENTMAP.articles.id}
              items={contents[CONTENTMAP.articles.id] || {}}
            />
          </div>
        ),
        disabled: false,
        id: CONTENTMAP.articles.id,
        name: `${t(CONTENTMAP.articles.name)} (${
          contents[CONTENTMAP.articles.id]?.total
        })`,
      }
      const solutionsTab = {
        content: (
          <div>
            <SolutionsTab
              handleTabClick={searchSolutions}
              query={queryToDisplay}
              id={CONTENTMAP.solutions.id}
              items={contents[CONTENTMAP.solutions.id] || {}}
            />
          </div>
        ),
        disabled: false,
        id: CONTENTMAP.solutions.id,
        name: `${t(CONTENTMAP.solutions.name)} (${
          contents[CONTENTMAP.solutions.id]?.total
        })`,
      }
      // Solutions and Services Tab
      const solutionsServicesTab = contentData[CONTENTMAP.solutionsAndServices.id];
      const solutionsAndServicesTab = {
        content: (
          <div>
            <SolutionsAndServicesTab
              handleTabClick={searchSolutionsAndServices}
              query={queryToDisplay}
              id={CONTENTMAP.solutionsAndServices.id}
              items={solutionsServicesTab || {}}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
            />
          </div>
        ),
        disabled: false,
        id: CONTENTMAP.solutionsAndServices.id,
        name: `${t(CONTENTMAP.solutionsAndServices.name)} (${
          solutionsServicesTab?.numFound
        })`,
      }
      if (solutionsServicesTab?.numFound) {
        tabs = [...tabs, solutionsAndServicesTab]
      }
      if (contents[CONTENTMAP.solutions.id]?.total) {
        tabs = [...tabs, solutionsTab]
      }
      if (contents[CONTENTMAP.articles.id]?.total) {
        tabs = [...tabs, articlesTab]
      }
      if (contents[CONTENTMAP.brands.id]?.total) {
        tabs = [...tabs, brandsTab]
      }
    }
    return tabs
  }, [contents, totalRecords, showFilters, contentData])

  updateQueryWithParams(urlQueryParams);

  if (origParams?.searchType === 'category') {
    hideHeroImageBanner()
  }

  return (
    <div className="c-search-page o-wrapper">
      <div className="o-grid o-grid--justify-between">
        <div className="o-grid__item">
          {queryToDisplay && (
            <>
              <h1 className="c-search-page__search-result u-h5 u-text-bold">
                {t('Search results:')}{' '}
                {hasCategoryFilterApplied && tabType === 'products'
                  ? `"${queryToDisplay}" ${t('in')} ${categoryName}`
                  : queryToDisplay}
              </h1>
              {contractName && contractName !== "All" &&
                <h1 className="c-search-page__search-result u-h5 u-text-bold">
                  {t('with')} {contractName}
                </h1>
              }
             </>
          )}
        </div>
        {docs && (
          <div className="c-horizontal-scroll u-margin-bot">
            {docs.slice(0, 5).map((doc, index) => (
              <SearchContentTile
                doc={doc}
                query={query}
                index={index}
                key={doc?.docId}
                isSolutionsServicesTab={isSolutionsServicesTab}
              />
            ))}
          </div>
        )}
        {Object.keys(contents).length > 0 && (
          <div className="c-search-page__search">
            <SearchTabs
              initialSelectedTab={tabs.findIndex(findTabIndex)}
              tabs={tabs}
              onTabClick={tabClickHandler}
            />
          </div>
        )}
      </div>
    </div>
  )
}

const processLegacyQuery = (queryString, isBrandPage,transformQuery) => {
  const params = new URLSearchParams(queryString)
  let nextParms = new URLSearchParams()
  if (transformQuery) {
  params.forEach(function (value, key) {
    switch (key) {
      case 'q':
        nextParms.set('q', value)
      case 'pq': {
        processPQ(value, nextParms)
      }
    }
  })
}else{
    nextParms = params
  }
  if (isBrandPage) {
    nextParms.set('searchType', 'brand')
  } else {
    // treat a page as category page only if it is not brand page
    if (nextParms.get('searchType') === 'category') {
      hideHeroImageBanner()
    }
  }
  return nextParms.toString()
}

const processPQ = (query, nextParms) => {
  // grab any VC category, any category,  'searchTerms' and update it to q in next params
  try {
    const queryObject = JSON.parse(query)
    const { searchTerms } = queryObject
    let virtualCategory, category, initialSearchTerm
    Object.keys(searchTerms).map((key) => {
      const { field, value } = searchTerms[key]
      switch (field) {
        case 'productSet':
          virtualCategory = value
          break
        case 'category':
          category = value
          nextParms.set('category', value)
          nextParms.set('searchType', 'category')
          break
        case 'searchTerm': {
          if (!initialSearchTerm) {
            nextParms.set('q', value)
            initialSearchTerm = value
          }
          break
        }
        case 'field': {
          // const currentQ = nextParms.get('q') || ''
          const [facetKey, facetValue] = value.split('~')
          if (
            facetKey === 'A-HYBRIS-ManufacturerId' ||
            facetKey === 'A-MARA-MFRNR'
          ) {
            nextParms.set('brand', facetValue)
          }
          /*
         // this is commented as Lucid works do not support this at the moment
          else {
            nextParms.set('q', `${currentQ} ${facetValue}`)
          }
          */
          break
        }
        default:
          break
      }
      // override category if there is virtual category
      if (virtualCategory) {
        nextParms.set('category', virtualCategory)
        nextParms.set('searchType', 'category')
      }
    })
  } catch (e) {
    console.warn('Unable to parse PQ')
  } finally {
    return nextParms
  }
}
