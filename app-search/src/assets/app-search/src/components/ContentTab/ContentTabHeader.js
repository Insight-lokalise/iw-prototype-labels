// React Modules
import React, { Fragment } from 'react'
import { Field } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'
import { getPageCountOptions } from "../../constants";
import TextView from '@insight/toolkit-react/lib/TextView/TextView'

export const ContentTabHeader = ({
  correctedSpelling,
  originalSpelling,
  currentPage,
  totalRecords,
  query,
  setRows,
  rows,
}) => {
  const handleChange = (e) => {
    const pageSize = e.currentTarget.value
    if (!pageSize) return null
    setRows(pageSize)
  }

  return (
    <section className="c-search-controls__top o-grid__item">
      <div className="c-search-controls__top__paging-container u-1/1 o-grid o-grid--justify-between o-grid--bottom">
        <div className="o-grid__item u-1/1 u-4/5@desktop">
           <div className="c-search-controls__top__recommendation u-1/1 o-grid">
              {correctedSpelling && `${t('No results for')} "${originalSpelling}" ${t('found')}`}
            </div>
        <div className="c-search-controls__top__results">
          {`${t('Showing')} `}
          {currentPage ? (
            <Fragment>
              {`${totalRecords > 0 ? ((currentPage - 1) * rows + 1) : 0} - ${totalRecords < currentPage * rows
                ? totalRecords
                : currentPage * rows} ${t('of')} `}
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
      <div className="c-search-controls__top__paging o-grid__item u-1/1 u-1/5@desktop">
          <div className="o-grid o-grid--bottom">
            <div className="o-grid__item">
              <div className="c-search-controls__top__paging__controls o-grid o-grid--justify-between">
                <Field
                  fieldComponent="Select"
                  className="o-grid__item o-grid__item--shrink u-1/3@tablet-"
                  type="select"
                  handleChange={handleChange}
                  aria-label={t('Page Sizes')}
                  name="pageSizes"
                  id="pageSizse"
                  options={getPageCountOptions()}
                  value={rows}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContentTabHeader
