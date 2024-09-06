// React Modules
import React, { useContext, Fragment } from 'react'
import cn from 'classnames'
import {Button, Field} from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'
import {ILISTVIEW, PAGECOUNTPRODUCTOPTIONS, SORTOPTIONS} from "../../constants";
import { SearchContext } from '../../context/SearchContext'
import TextView from '@insight/toolkit-react/lib/TextView/TextView'

export const SearchControlsTop = ({
  correctedSpelling,
  originalSpelling,
  start,
  toggleFilters,
  currentPage,
  totalRecords,
  query,
  currentPageSize,
  setRows,
  setCustomSort,
  rows,
  customSort,
  pageCountOptions,
  showSortOptions = true,
  showPageOptions = true,
  showPageViewOptions = true
}) => {
  const { view, dispatch } = useContext(SearchContext)
  const handleViewClick = (view) => {
    dispatch({
      type: 'SET_PRODUCT_VIEW',
      payload: { view: view }
    })
  }
  const sortOptionsLocalized = SORTOPTIONS.map(({text, ...rest}) => ({text: t(text), ...rest}));
  const pageCountOptionsList = pageCountOptions?.length > 0 ? pageCountOptions : PAGECOUNTPRODUCTOPTIONS;
  const showSortAndPageViewOptions = showSortOptions && showPageViewOptions;

  return (
    <section className="c-search-controls__top o-grid">

      <div className="c-search-controls__top__paging-container u-1/1 o-grid o-grid--justify-between o-grid--bottom">
        <div className="o-grid__item u-1/1 u-3/5@desktop">
          <div className="c-search-controls__top__recommendation u-1/1 o-grid">
            {correctedSpelling && `${t('No results for')} "${originalSpelling}" ${t('found')}`}
          </div>
          <div className="c-search-controls__top__results">
              {`${t('Showing')} `}
              {currentPage ? (
                <Fragment>
                  {`${totalRecords > 0 ? start + 1 : 0} - ${totalRecords < currentPage * currentPageSize
                    ? totalRecords
                    : currentPage * currentPageSize} ${t('of')} `}
                </Fragment>
              ) : null}
            {` ${totalRecords}`}&nbsp;
              {query ?
                <Fragment>
                  <div>{`${t('results for')}`}&nbsp;</div>
                  <i>"</i>
                  <TextView className={'u-text-bold c-search-controls__top__query'} text={query}/>
                  <i>"</i>
                </Fragment>
                :
                t('results')
              }
          </div>
        </div>
        <div className="o-grid__item c-search-controls__top__apply-filters u-1/1">
          <Button className="c-button--block" color="secondary" size="small" onClick={toggleFilters}>
            {t('Filters')}
          </Button>
        </div>
        <div className={cn("c-search-controls__top__paging o-grid__item u-1/1 u-2/5@desktop", {
            'o-grid': !showSortAndPageViewOptions,
          })}>
          <div className="o-grid o-grid--bottom">
            <div className="o-grid__item">
              <div className="c-search-controls__top__paging__controls o-grid o-grid--justify-between">
                {showSortOptions && (
                  <Field
                    fieldComponent="Select"
                    className="o-grid__item u-2/3"
                    type="select"
                    handleChange={(e) => {
                      const sort = e.currentTarget.value
                      if (!sort) return null
                      setCustomSort(sort)
                    }}
                    aria-label={t('Sort')}
                    name="sort"
                    id="sort"
                    options={sortOptionsLocalized}
                    value={customSort}
                  />
                )}
                {showPageOptions && (
                  <Field
                    fieldComponent="Select"
                    className="o-grid__item o-grid__item--shrink u-1/3@tablet-"
                    type="select"
                    handleChange={(e) => {
                      const pageSize = e.currentTarget.value
                      if (!pageSize) return null
                      setRows(pageSize)
                    }}
                    aria-label={t('Page Size')}
                    name="pageSize"
                    id="pageSize"
                    options={pageCountOptionsList}
                    value={rows}
                  />
                )}
              </div>
            </div>
            {showPageViewOptions && (
              <div className="o-grid__item o-grid__item--shrink">
                <div className="c-search-controls__top__paging__view-toggle">
                  <Button
                    aria-label={t('List View')}
                    className={cn({
                      active: view === ILISTVIEW.list,
                    })}
                    icon="list"
                    size="small"
                    onClick={()=>handleViewClick(ILISTVIEW.list)}
                  />
                  <Button
                    aria-label={t('Grid View')}
                    className={cn({
                      active: view === ILISTVIEW.grid,
                    })}
                    icon="tile"
                    size="small"
                    onClick={()=>handleViewClick(ILISTVIEW.grid)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default SearchControlsTop
