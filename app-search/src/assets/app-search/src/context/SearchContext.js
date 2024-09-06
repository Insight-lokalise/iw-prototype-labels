import React, { createContext, useEffect, useReducer, useState } from 'react'
import { SSE } from 'sse.js'
import { fetchSearch, getProductSearch, getSessionUser } from '../api'
import { makeProductDetailURL } from '@insight/toolkit-react/lib/PDPModal/PDPHelpers'
import { getCurrentLocale, getDefaultLoggedOutSalesOrg } from '@insight/toolkit-utils/lib/helpers'
import { t } from '@insight/toolkit-utils/lib/labels'
import { isHybridXEnabled, addFieldsForHybridX } from 'app-api-user-service'
import {
  fetchAEMContent,
  fetchContentSearch,
  fetchSolutionsAndServices,
} from '../api/getData'
import { ILISTVIEW, INSIGHT_CURRENT_LOCALE_COOKIE_NAME } from '../constants'
import contentURL from '../shared/aemContentUrl'
import { splitFacets } from '../shared/utils'

const locale = getCurrentLocale(INSIGHT_CURRENT_LOCALE_COOKIE_NAME)
const isInstockOnlyFlagEnabled =
  window.flags && window.flags['GNA-9998-IN-STOCK']
const initialState = {
  country: 'US',
  currency: 'USD',
  instockOnly: isInstockOnlyFlagEnabled ? 'false' : 'true',
  lang: 'en_US',
  salesOrg: getDefaultLoggedOutSalesOrg(locale),
  products: [],
  contents: {},
  numFound: 1,
  start: 0,
  rows: 50,
  view: ILISTVIEW.list,
  customSort: 'best_match',
  pages: 1,
  pageNumber: 1,
  facets: [],
  origFacetDisplays: {},
  selectedFilters: new Map(),
  isSearching: true,
  query: '',
  origParams: {},
  noResultsFound: false,
  signalMetaData: {},
  docs: [],
  contentData: {}
}

const searchSourceMap = {
  k: 'search',
  h: 'search',
  s: 'recommendation',
}

export const SearchContext = createContext(initialState)

export function SearchProvider({ children }) {
  const [
    {
      originalSpelling,
      correctedSpelling,
      country,
      currency,
      fusionQueryId,
      instockOnly,
      lang,
      salesOrg,
      products,
      contents,
      docs,
      numFound,
      start,
      rows,
      view,
      customSort,
      origFacetDisplays,
      pages,
      pageNumber,
      originalFilters,
      selectedFilters,
      searchSource,
      facets,
      isSearching,
      error,
      query,
      qsrc,
      origParams,
      outOfStockOnly,
      noResultsFound,
      signalMetaData,
      contentData
    },
    dispatch,
  ] = useReducer(reducer, initialState);
  const [response, setResponse] = useState(null)
  const [priceInfo, setPriceInfo] = useState(null)
  const [searchSSEComplete, setSearchSSEComplete] = useState(false)
  const [searchSSEError, setSearchSSEError] = useState(false)
  const params = new URLSearchParams(window?.location?.search);
  const [tabType, setTabtype] = useState(params.get('tabType') || 'products');

  useEffect(() => {
    processProducts()
  }, [response, docs])

  function setSearchSource(payload) {
    dispatch({ type: 'SET_SEARCH_SOURCE', payload })
  }

  const processParams = (queryString, contents, salesOrg) => {
    const params = new URLSearchParams(queryString)
    const country = locale.split('_')[1]
    // store search source in state so that we can update signals
    if (params.has('qsrc')) {
      setSearchSource({
        searchSource: searchSourceMap[params.get('qsrc')],
        qsrc: params.get('qsrc'),
        salesOrg,
      })
    } else if (params.has('searchType')) {
      setSearchSource({ searchSource: params.get('searchType'), salesOrg })
    }
    // add default params if they are not in initial query string
    if (!params.has('country')) params.set('country', country)
    if (!params.has('instockOnly'))
      params.set('instockOnly', isInstockOnlyFlagEnabled ? 'false' : 'true')
    if (!params.has('lang'))
      params.set('lang', locale === 'en_CA' ? 'en_US' : locale)
    if (!params.has('locale')) params.set('locale', locale)
    if (!params.has('rows')) params.set('rows', '50')
    if (!params.has('start')) params.set('start', '0')
    if (!params.has('salesOrg')) params.set('salesOrg', salesOrg)
    if (params.has('licenseContractIds')) {
      params.set('selectedContractIDs', params.get('licenseContractIds'))
    }

    //remove duplicate params since these will be appended by fetchSearch api
    params.delete('userSegment')
    params.delete('sessionId')
    params.delete('userId')
    params.delete('soldTo')
    params.delete('webGroup')
    params.delete('licenseContractIds')
    return params
  }

  const searchProducts = async (queryString, contents, salesOrg, contract) => {
    // if (!inputString || inputString === query) return;
    try {
      dispatch({ type: 'INITIATED', payload: queryString })
      const params = processParams(queryString, contents, salesOrg)
      const {
        isLoggedIn,
        isIpsLogo,
        sessionId,
        userInformation: {
          isCES,
          currencyCode,
          webGroup: { webGroupId: webGroup } = {},
          account: { soldToId: soldTo } = {},
          isIpsUser: loginIpsUser,
          webLoginProfileId: userId,
          UserType: userType,
        } = {} }
        = await getSessionUser();
      if ((isIpsLogo || loginIpsUser) && !!contract) {
        // if it's logout/login ips and contract is been selected then call eventStream and get data
        const nonLoggedInIpsUser = !isLoggedIn && isIpsLogo
        const ipsUser = nonLoggedInIpsUser || isLoggedIn && loginIpsUser
        const payload = {}

        params.forEach((value, key) => {
          payload[key] = value;
        })
        if (payload['selectedContractIDs']) {
          const selectedContractIDs = payload['selectedContractIDs'];
          payload['selectedContractIDs'] = selectedContractIDs.includes(',') ? selectedContractIDs.split(',') : selectedContractIDs;
        }
        payload['userSegment'] = 'CES'
        payload['sessionId'] = encodeURIComponent(sessionId)

        if (isLoggedIn) {
          if (soldTo && webGroup) {
            payload['userId'] = userId
            payload['soldTo'] = soldTo
            payload['webGroup'] = webGroup
            payload['currencyCode'] = currencyCode
            await addFieldsForHybridX({ isLoggedIn, isCES }, payload, { userType })
          } else {
            payload['userId'] = userId
          }
        }
        payload['returnPrice'] = 'async'
        setSearchSSEComplete(false)
        getSeachData(payload, contract)
      } else {
        const res = await (isHybridXEnabled(isLoggedIn, isCES) ? getProductSearch(params) : fetchSearch(params.toString()));
        if (!res) {
          dispatch({ type: 'ERROR_RESET_SEARCH', payload: queryString });
          return;
        }
        setResponse(res.data)
      }
    } catch (e) {
      dispatch({ type: 'ERROR_RESET_SEARCH', payload: queryString });
    }
  }

  const getSeachData = async (payload, contract) => {
    const source = new SSE("/gapi/product-search/search-sse", {
      headers: { 'Content-Type': 'application/json', 'charset': 'utf-8' },
      method: 'POST',
      payload: JSON.stringify({ ...payload, "contractId": contract?.contractNumber, "contractType": contract?.contractName })
    });

    source.addEventListener('readystatechange', e => {
      if(e.readyState === 2) {
        setSearchSSEComplete(true)
      }
    })

    source.addEventListener('productInfo', function (e) {
      const payload = e.data;
      setResponse(JSON.parse(payload))
    });

    source.addEventListener('prices', function (e) {
      const payload = e.data;
      setPriceInfo(prevData => ({ ...prevData, ...JSON.parse(payload) }))
    });

    source.addEventListener('error', function (e) {
      setSearchSSEError(true)
    });
  }

  const processProducts = () => {
    if (!!response) {
      const data = response
      const {
        products,
        fusionQueryId,
        salesOrg,
        numFound,
        origFacetDisplays,
        origParams,
        origParams: { q },
      } = data

      data.signalMetaData = JSON.stringify({
        fusionQueryId,
        origParams,
        origFacetDisplays,
      })
      // store Fusion query ID in session storage, so that PDP page can fire a signal with right fusion query ID
      window.sessionStorage.setItem('fusionQueryId', fusionQueryId)
      window.sessionStorage.setItem('signalMetaData', data.signalMetaData)
      if (products.length === 1) {
        const keyword = params.has('q') && params.get('q')
        const {
          description,
          materialId,
          manufacturerName,
          manufacturerPartNumber,
        } = products[0]

        if (keyword && keyword?.toLowerCase() === materialId?.toLowerCase()) {
          // search by material ID
          // redirect to PDP
          const pdpURL = makeProductDetailURL({
            materialId,
            mfrName: manufacturerName,
            description,
            manufacturerId: manufacturerPartNumber,
          })
          if (!!pdpURL) {
            // during development time, we saw some missing data. which resulted in empty URL
            console.warn(
              'Insufficient data to prepare product URL',
              materialId,
              manufacturerName,
              description,
              manufacturerPartNumber
            )
            window.location.href = pdpURL
          }
        }
      }

      dispatch({ type: 'COMPLETED', payload: { data, contents, salesOrg } })
      // populate digital data with search info, only firing this event when there is search term
      const querySrc = qsrc || params.get('qsrc')
      if (q && q !== '*:*') {
        const contentTilesData = docs?.slice(0, 5)
        const searchType =
          {
            k: 'Typed In',
            h: 'History',
            s: 'Suggested',
            c: 'Suggested - Category',
            p: 'Suggested - Product',
            '': 'NA',
          }[querySrc] || ''
        const searchInfo = {
          searchKeyword: q,
          searchType,
          resultCounts: {
            productsCount: numFound,
          },
          searchFilter: {
            origFacetDisplays: data.origFacetDisplays,
            origParams: data.origParams,
            totalArticles: contentTilesData.length
          },
        }
        window.fireTagEvent('searchInfo', searchInfo)
      }
    } else {
      return null
    }
  }

  const searchBrands = async ({ searchText, pageSize, currentPage }) => {
    const searchPaths = contentURL('brands', locale)
    const { data } = await fetchAEMContent({
      searchText,
      pageSize,
      currentPage,
      searchPaths,
    })
    return data
  }

  const searchArticles = async ({ searchText, pageSize, currentPage }) => {
    const searchPaths = contentURL('articles', locale)
    const { data } = await fetchAEMContent({
      searchText,
      pageSize,
      currentPage,
      searchPaths,
    })
    return data
  }

  const searchSolutions = async ({ searchText, pageSize, currentPage }) => {
    const searchPaths = contentURL('solutions', locale)
    const { data } = await fetchAEMContent({
      searchText,
      pageSize,
      currentPage,
      searchPaths,
    })
    return data
  }

  const searchSolutionsAndServices = async ({
    queryString,
    tabType
  }) => {
    try {
      dispatch({ type: 'SEARCH_CONTENT', payload: { queryString, tabType, isSearching: true } })

      const params = new URLSearchParams(queryString);
      const country = locale.split('_')[1];
      // store search source in state so that we can update signals
      if (params.has('qsrc')) {
        setSearchSource({
          searchSource: searchSourceMap[params.get('qsrc')],
          qsrc: params.get('qsrc'),
          salesOrg,
        })
      } else if (params.has('searchType')) {
        setSearchSource({ searchSource: params.get('searchType'), salesOrg })
      }
      // add default params if they are not in initial query string
      if (!params.has('country') || !params.get('country')) params.set('country', country)
      if (!params.has('lang') || !params.get('lang')) params.set('lang', locale === 'en_CA' ? 'en_US' : locale)
      if (!params.has('locale') || !params.get('locale')) params.set('locale', locale)
      if (!params.has('rows') || !params.get('rows')) params.set('rows', '50')
      if (!params.has('start') || !params.get('start')) params.set('start', '0')
      if (!params.has('salesOrg') || !params.get('salesOrg')) params.set('salesOrg', salesOrg)


      const { userInformation, isLoggedIn, sessionId: session } = await getSessionUser();
      const userId = userInformation?.cdmUid;
      const soldTo = userInformation?.account?.soldToId;
      const webGroup = userInformation?.webGroup?.webGroupId;
      const userSegment = 'CES';
      const sessionId = encodeURIComponent(session);

      let paramsObj = Object.fromEntries(params);
      const requestParams = {
        ...paramsObj,
        userId,
        userSegment,
        sessionId,
        ...((isLoggedIn && soldTo && webGroup) && {
          soldTo,
          webGroup
        })
      };

      const { data } = await fetchSolutionsAndServices(requestParams);
      const payload = { data, products, salesOrg, tabType, userSegment, sessionId };
      dispatch({ type: 'SET_CONTENTS', payload });
      return data;
    } catch (e) {
      dispatch({ type: 'SEARCH_CONTENT', payload: { tabType } })
      console.warn('Error while fetching solutions and services: ', e);
      return {};
    }
  }

  const searchDocs = async ({ searchText, salesOrg }) => {
    const { data } = await fetchContentSearch({
      searchText,
      locale,
      salesOrg,
    })
    dispatch({ type: 'SET_DOCS', payload: data?.docs || [] })
  }

  const clearFilters = () => {
    dispatch({ type: 'CLEAR_FILTERS' })
  }

  const setFilter = (option, clearGroup) => {
    const key = `${option.group}:${option.val}`
    // Find and remove all queries in the selected group
    if (clearGroup) {
      selectedFilters.forEach((filter) => {
        if (filter.group == option.group) {
          selectedFilters.delete(`${filter.group}:${filter.value}`)
        }
      })
    }
    // Find and remove the selected filter if set
    if (selectedFilters.has(key)) {
      selectedFilters.delete(key)
      dispatch({ type: 'UPDATE_FILTERS', payload: selectedFilters })
      return
    }
    dispatch({
      type: 'UPDATE_FILTERS',
      payload: new Map(selectedFilters.set(key, option)),
    })
    // TODO: persist new map to url
  }

  return (
    <SearchContext.Provider
      value={{
        originalSpelling,
        correctedSpelling,
        country,
        currency,
        error,
        fusionQueryId,
        instockOnly,
        lang,
        salesOrg,
        products,
        priceInfo,
        searchSSEError,
        searchSSEComplete,
        contents,
        docs,
        numFound,
        start,
        rows,
        view,
        customSort,
        origFacetDisplays,
        pages,
        pageNumber,
        facets,
        originalFilters,
        selectedFilters,
        isSearching,
        searchProducts,
        processProducts,
        getSeachData,
        searchBrands,
        searchArticles,
        searchSolutions,
        searchSolutionsAndServices,
        searchDocs,
        clearFilters,
        setFilter,
        searchSource,
        query,
        qsrc,
        origParams,
        outOfStockOnly,
        noResultsFound,
        signalMetaData,
        tabType,
        setTabtype,
        contentData,
        dispatch,
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}

function reducer(state, { type, payload }) {
  switch (type) {
    case 'INITIATED':
      return { ...state, isSearching: true, query: payload, error: false }
    case 'ERROR_RESET_SEARCH':
      return { ...state, isSearching: false, numFound: 0, error: true, query: payload }
    case 'FETCH_CONTENTS':
      return { ...state, contents: payload }
    case 'CLEAR_FILTERS':
      return { ...state, selectedFilters: new Map() }
    case 'UPDATE_FILTERS':
      return { ...state, selectedFilters: new Map(payload) }
    case 'SET_SEARCH_SOURCE':
      return { ...state, ...payload }
    case 'SET_DOCS':
      return { ...state, docs: payload }
    case 'SET_PRODUCT_VIEW':
      return { ...state, ...payload }
    case 'RESET_PAGE': {
      const tabType = payload?.tabType;
      const existingContentData = state?.contentData || {};
      const existingTabData = existingContentData?.[tabType] || {};
      const tabData = {
        ...existingTabData,
        pageNumer: initialState.pageNumber,
      };
      return {
        ...state,
        pageNumber: initialState.pageNumber,
        [tabType]: tabData
      }
    }
    /**
     * For Product Tab
     */
    case 'COMPLETED': {
      const { origParams, origFacetDisplays, products } = payload?.data
      const instockOnly = origParams?.instockOnly === 'true' ? true : false
      const customSort = origParams?.customSort
      const { rangeFacet, selectedFacet } = origParams
      const selectedFilters = new Map()
      const country = locale.split('_')[1]

      if (instockOnly) {
        selectedFilters.set('instockOnly', {
          key: 'instockOnly',
          type: 'instockOnly',
          label: t('In stock only'),
          val: instockOnly,
        })
      }
      processSelectedFacets(rangeFacet, origFacetDisplays, selectedFilters)
      processSelectedFacets(selectedFacet, origFacetDisplays, selectedFilters)
      // Generate next state
      let nextState = {
        ...state,
        customSort,
        isSearching: false,
        error: false,
        lang: locale === 'en_CA' ? 'en_US' : locale,
        locale,
        ...payload?.data,
        country,
        language: locale === 'en_CA' ? 'en_US' : locale,
        instockOnly,
        originalFilters: new Map(selectedFilters),
        salesOrg: payload.salesOrg,
        selectedFilters,
      }
      // identify out of stock only parts in search response
      // we will not receive instockOnly in origparams
      nextState = {
        ...nextState,
        outOfStockOnly: !origParams.hasOwnProperty('instockOnly'),
      }
      // Check if products are returned from search API and no facets applied
      let isEmptyContent = false
      if (state?.contents && Object.keys(state?.contents).length > 0) {
        isEmptyContent = Object.values(state.contents).every(
          (content) => content?.total === 0 || content?.numFound === 0
        )
      }

      nextState = {
        ...nextState, noResultsFound: (
          !products?.length &&
          Object.keys(origFacetDisplays).length === 0 &&
          isEmptyContent
        )
      }

      return nextState
    }
    /**
     * For Content Tabs
     */
    case 'SEARCH_CONTENT': {
      const tabType = payload?.tabType;
      const existingContentData = state?.contentData || {};
      const existingTabData = existingContentData?.[tabType] || {};
      const tabData = {
        ...existingTabData,
        isSearching: !!payload?.isSearching,
      };
      return {
        ...state,
        contentData: {
          ...existingContentData,
          [tabType]: tabData
        }
      }
    }
    case 'UPDATE_CONTENT_FILTERS': {
      const tabType = payload?.tabType;
      const existingContentData = state?.contentData || {};
      const existingTabData = existingContentData?.[tabType] || {};
      const tabData = {
        ...existingTabData,
        selectedFilters: payload?.clearAllFilters ? new Map() : new Map(payload?.selectedFilters)
      };
      return {
        ...state,
        contentData: {
          ...existingContentData,
          [tabType]: tabData
        }
      }
    }
    case 'SET_CONTENTS': {
      const { tabType, salesOrg, products, data = {}, userSegment, sessionId } = payload || {};
      const { origParams, origFacetDisplays, docs, numFound } = data;
      const { selectedFacet, start, rows } = origParams;
      const selectedFilters = new Map();
      const country = locale.split('_')[1];
      const lang = locale === 'en_CA' ? 'en_US' : locale;
      const pageNumber = (start / rows) + 1;
      const pages = Math.ceil(numFound / rows);

      processSelectedFacets(selectedFacet, origFacetDisplays, selectedFilters);

      let tabData = {
        // api response
        ...data,
        lang,
        locale,
        country,
        language: lang,
        userSegment,
        sessionId,
        salesOrg,
        isSearching: false,
        // filters data
        selectedFilters,
        originalFilters: new Map(selectedFilters),
        // pagination data
        pageNumber,
        start: Number(start),
        rows: Number(rows),
        pages
      }

      // Generate next state
      let nextState = {
        ...state,
        contentData: {
          ...state.contentData,
          [tabType]: tabData
        }
      }

      // If Data is not present for any tab
      let isEmptyContent = false
      if (state?.contents && Object.keys(state?.contents).length > 0) {
        isEmptyContent = Object.values(state.contents).every(
          (content) => content?.total === 0 || content?.numFound === 0
        )
      }
      const noResult = !docs?.length && !state.products?.length && Object.keys(origFacetDisplays)?.length === 0 && isEmptyContent
      if(!state.isSearching){
        nextState = { ...nextState, noResultsFound: noResult }
      }

      return nextState
    }
  }
}

const processSelectedFacets = (facet, originalFacetArray, selectedFilters) => {
  if (facet) {
    const facetArray = Array.isArray(facet) ? facet : splitFacets(facet);
    facetArray.map((range) => {
      const [rKey] = range.split(':')
      originalFacetArray[rKey].map(({ key, value: val, ...rest }) => {
        selectedFilters.set(`${key}:${val}`, { key, val, ...rest });
      });
    })
  }
}
