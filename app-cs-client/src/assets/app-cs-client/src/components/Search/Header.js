import React from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils'

export default function Header({ currentPage, pageCount, results, resultCount, beyondSearchLimit, searchString, searchInitiated }) {
  const pageResultCount = () => {
    if (currentPage === pageCount) {
      return currentPage * 25 + results[currentPage].length
    }
    return (currentPage + 1) * 25
  }
  return (
    <div className="o-grid o-grid--justify-between o-grid--bottom u-font-size-small">
      <h4 className="o-grid__item o-grid__item--shrink u-margin-none">{searchInitiated ? `${t('Search results for')} "${searchString}"`: t('Search results')}</h4>
      <div className="o-grid__item o-grid__item--shrink u-font-size">
        {resultCount > 0 ? `${t('Showing')} ${(currentPage * 25) + 1} ${t('to')} ${resultCount < 25 ? resultCount : pageResultCount()} ${t('of')} ${resultCount}${beyondSearchLimit ? '+' : ''} ${t('results')}` : t('Showing 0 results')}
      </div>
    </div>
  )
}

Header.propTypes = {
  currentPage: PropTypes.number.isRequired,
  resultCount: PropTypes.number.isRequired,
  beyondSearchLimit: PropTypes.bool,
  searchString: PropTypes.string.isRequired,
  pageCount: PropTypes.number.isRequired,
  results: PropTypes.arrayOf(PropTypes.array).isRequired,
  searchInitiated: PropTypes.bool.isRequired,
}

Header.defaultProps = {
  beyondSearchLimit: false,
}
