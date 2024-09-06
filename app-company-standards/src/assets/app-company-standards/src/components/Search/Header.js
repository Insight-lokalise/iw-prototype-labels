import React from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils'

export default function Header({ currentPage, pageCount, results, resultCount, beyondSearchLimit, searchString }) {
  const pageResultCount = () => {
    if (currentPage === pageCount) {
      return currentPage * 25 + results[currentPage].length
    }
    return (currentPage + 1) * 25
  }
  return (
    <div className="o-grid o-grid--justify-between o-grid--bottom u-font-size-small">
      <h2 className="o-grid__item o-grid__item--shrink u-margin-none i-margin-bot-none">{`${t('Search Results for')} "${searchString}"`}</h2>
      <div className="o-grid__item o-grid__item--shrink u-font-size">
        {`${t('Showing')} ${(currentPage * 25) + 1} ${t('to')} ${resultCount < 25 ? resultCount : pageResultCount()} ${t('of')} ${resultCount}${beyondSearchLimit ? '+' : ''} ${t('results')}`}
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
  results: PropTypes.arrayOf(PropTypes.array).isRequired
}

Header.defaultProps = {
  beyondSearchLimit: false,
}
