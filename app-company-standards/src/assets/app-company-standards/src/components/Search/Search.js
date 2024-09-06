import React, { useContext, useEffect, useState, Fragment } from 'react'
import { Button, Icon, Loading } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'

import { SearchContext } from './SearchContext'
import Header from './Header'
import Paginator from './Paginator'
import Result from './Result'

export default function Search(props) {
  const { isSearching, pageCount, resultCount, results, search, searchString, searchInitiated } = useContext(SearchContext)
  useEffect(() => {
    if (!isSearching && results.length === 0 && searchString) search(searchString)
  }, [])
  const [currentPage, setCurrentPage] = useState(0)
  if (currentPage > pageCount) setCurrentPage(0)
  const noResults = searchInitiated ? (
    <div className='o-grid__item u-1/1 u-padding-top'>
      <span>{t('No results found')}</span>
    </div>
  ) : (
    <div className='o-grid__item u-1/1 u-padding-top'>
      <span>{t('Enter a search term above')}</span>
    </div>
  )
  return (
    <div className="o-grid u-padding-side-small">
      <div className="o-grid__item u-1/1">
        {isSearching ? (
          <div className='o-grid__item'>
            <Loading />
          </div>
        ) : (
          <div className="o-grid">
            <div className="o-grid__item u-1/1">
              <Button
                className="c-cs-back--button u-font-size-small i-padding-top-none"
                color="link"
                onClick={() => {
                  props.history.goBack()
                }}
              >
                <Icon icon="arrow-dropdown" className="c-cs-back--icon" /> {t('Back')}
              </Button>
            </div>
            <div aria-label='searchResults' className="o-grid__item u-1/1">
              {results && results[currentPage] ? (
                <Fragment>
                  <div className={"o-grid__item u-1/1 u-margin-bot-small"}>
                    <Header currentPage={currentPage} pageCount={pageCount} results={results} resultCount={resultCount} searchString={searchString} />
                  </div>
                  <div className="o-grid__item u-1/1">
                    {results && results[currentPage] && results[currentPage].map((result, index) => (
                      <Result key={`${result.resultId}-${index}`} {...result} />
                    ))}
                  </div>
                  <div className='o-grid__item'>
                    <Paginator changePage={setCurrentPage} currentPage={currentPage} maxPage={pageCount} />
                  </div>
                </Fragment>
              ) : (
                <Fragment>
                  {noResults}
                </Fragment>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

