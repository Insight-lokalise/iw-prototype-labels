// React Modules
import React, { useContext } from 'react'

// Application Modules
import { SearchControlsTop } from './SearchControlsTop'
import { SearchControlsBottom } from './SearchControlsBottom'
import { DEFAULT_PAGE_COUNT } from '../../constants'
import { SearchContext } from '../../context/SearchContext'
import { noOp } from '../../shared/utils'

const SearchControls = ({
  clearFilters,
  currentPage,
  originalSpelling,
  correctedSpelling,
  start,
  searchHandler,
  setFilter,
  setRange = noOp,
  setStockFilter,
  toggleFilters,
  totalRecords,
  query,
  pageCountOptions,
  showSortOptions,
  showPageOptions,
  showPageViewOptions,
  pageSize
}) => {
  const { rows: contextRows, customSort, dispatch, tabType } = useContext(SearchContext)
  const rows = pageSize || contextRows;
  const currentPageSize = rows || DEFAULT_PAGE_COUNT;

  const onRowsChange = (rows) => {
    dispatch({
      type: 'RESET_PAGE',
      payload: { tabType }
    });
    searchHandler({ key: 'rows', value: rows });
  }

  const onCustomSortChange = (sort) => {
    searchHandler({ key: 'customSort', value: sort })
  }

  return (
    <section className="c-search-controls">
      <SearchControlsTop
        start={start}
        currentPage={currentPage}
        currentPageSize={currentPageSize}
        totalRecords={totalRecords}
        query={query}
        correctedSpelling={correctedSpelling}
        originalSpelling={originalSpelling}
        rows={rows}
        setRows={onRowsChange}
        customSort={customSort}
        toggleFilters={toggleFilters}
        setCustomSort={onCustomSortChange}
        pageCountOptions={pageCountOptions}
        showSortOptions={showSortOptions}
        showPageOptions={showPageOptions}
        showPageViewOptions={showPageViewOptions}
      />
      <SearchControlsBottom
        clearFilters={clearFilters}
        setFilter={setFilter}
        setRange={setRange}
        setStockFilter={setStockFilter}
      />
    </section>
  )
}

export default SearchControls
