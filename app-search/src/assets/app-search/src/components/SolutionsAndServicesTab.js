import React, { useEffect, useState, useContext } from 'react';
import { Loading, Pagination } from '@insight/toolkit-react';
import SearchFilter from './SearchFilter/SearchFilter';
import { SearchContext } from '../context/SearchContext';
import { getPageCountOptions } from '../constants';
import SearchControls from './SearchControls/SearchControls';
import { getUpdatedSearchParams, resetSearchParams } from '../shared/searchParams';
import { NoResultsFoundWithFacets } from './SearchNotFound/NoResultsFoundWithFacets';
import { scrollToTop, splitFacets, containsSpaceOrDoubleQuote, escapeDoubleQuotes } from '../shared/utils';
import { ContentRowForSolAndSerTab } from './ContentTab/ContentRowForSolAndSerTab';

export const SolutionsAndServicesTab = ({
  query,
  showFilters = false,
  setShowFilters,
}) => {
  const {
    searchSolutionsAndServices,
    contentData,
    dispatch,
    tabType
  } = useContext(SearchContext);
  const items = contentData?.[tabType];

  const {
    origParams,
    facets,
    docs,
    numFound,
    isSearching,
    selectedFilters,
    originalSpelling,
    correctedSpelling,
    pageNumber: currentPage,
    start,
    rows,
    pages: totalPages
  } = items || {};

  const [contents, setContents] = useState(docs);

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
        : splitFacets(currentSelectedFacets);

      optionGroups.map((optionGroup) => {
        const [groupName, values] = optionGroup.split(':')
        selectedFacetsMaps[groupName] = values.split('|')
      });

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
    setContentFilter(option, clearGroup)
  }

  const onFilterChange = (option, clearGroup) => {
    handleFilterChange('selectedFacet', option, clearGroup)
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  const getRequestForSolutionsAndServices = (searchParams, pageSize) => ({
    queryString: searchParams.toString(),
    tabType
  });

  const onHandleClearAll = () => {
    if ('URLSearchParams' in window && Object.keys(origParams).length > 0) {
      const searchParams = resetSearchParams(origParams);
      const request = getRequestForSolutionsAndServices(searchParams);
      searchSolutionsAndServices(request);
    }
    dispatch({
      type: 'UPDATE_CONTENT_FILTERS',
      payload: { tabType, clearAllFilters: true }
    });
  }

  const searchHandler = ({ key, value }) => {
    if ('URLSearchParams' in window && Object.keys(origParams).length > 0) {
      const searchParams = getUpdatedSearchParams(origParams, key, value);
      const request = getRequestForSolutionsAndServices(searchParams);
      searchSolutionsAndServices(request);
    }
  }

  // Update Facets
  const setContentFilter = (option, clearGroup) => {
    const existingContentData = contentData || {};
    const existingTabData = existingContentData?.[tabType] || {};
    const selectedFilters = existingTabData?.selectedFilters;
    const key = `${option.group}:${option.val}`;
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
      dispatch({ type: 'UPDATE_CONTENT_FILTERS', payload: {
        selectedFilters,
        tabType
      }});
      return;
    }
    dispatch({
      type: 'UPDATE_CONTENT_FILTERS',
      payload: {
        selectedFilters: new Map(selectedFilters.set(key, option)),
        tabType
      }
    });
  }

  const onPageChange = (page) => {
    searchHandler({ key: 'start', value: Number(origParams.rows) * (page - 1) });
    scrollToTop();
  }

  useEffect(() => {
    if (items?.docs) {
      setContents(items?.docs);
    }
  }, [items]);

  return (    
      <div className="o-grid solutions-services-wrapper">
        <div className="c-search-page__filters-container o-grid__item u-1/1 u-1/4@desktop">
          <SearchFilter
            outOfStockOnly
            facets={facets}
            showFilters={showFilters}
            selectedFilters={selectedFilters}
            setFilter={onFilterChange}
            toggleFilters={toggleFilters}
          />
        </div>
        <div className="c-search-page__products-container o-grid__item u-1/1 u-3/4@desktop">
          <SearchControls
            query={query}
            start={start}
            pageSize={rows}
            showSortOptions={false}
            showPageViewOptions={false}
            totalRecords={numFound}
            currentPage={currentPage}
            originalSpelling={originalSpelling}
            correctedSpelling={correctedSpelling}
            pageCountOptions={getPageCountOptions()}
            setFilter={onFilterChange}
            toggleFilters={toggleFilters}
            clearFilters={onHandleClearAll}
            searchHandler={searchHandler}
          />
          {(!isSearching && !contents?.length) ? (
            <NoResultsFoundWithFacets clearFilters={onHandleClearAll} />
          ) : (
            <SolutionAndServicesTabItem  contents={contents} isSearching={isSearching} onFilterChange={onFilterChange}/>
          )}
        </div>
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          pageHandler={onPageChange}
        />
      </div>
  )
}

export default SolutionsAndServicesTab;

const SolutionAndServicesTabItem = ({ contents, isSearching, onFilterChange }) => {
  return contents && (
    <>
      {isSearching && (
        <div className="o-grid o-grid--justify-center u-margin-bot-small">
          <div className="o-grid__item o-grid__item--shrink">
            <Loading size={'large'} />
          </div>
        </div>
      )}
      <div className="search-results-wrapper">
        {contents.map((item, id) => {
          const { title, displayDate, pagePath, contentType, description, imageUrl, topics } = item;
          return <ContentRowForSolAndSerTab
            title={title}
            articleDate={displayDate}
            path={pagePath}
            excerpt={description}
            articleType={contentType}
            id={id}
            key={id}
            imageUrl={imageUrl}
            topics={topics}
            onTopicChange={onFilterChange}
          />
        })}
      </div>
    </>
  )
}
