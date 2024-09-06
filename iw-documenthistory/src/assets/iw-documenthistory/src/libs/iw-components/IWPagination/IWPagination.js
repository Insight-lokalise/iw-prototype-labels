import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

import { t } from '@insight/toolkit-utils/lib/labels'
import { IWAnchor } from '../IWAnchor/IWAnchor'

export default class IWPagination extends PureComponent {
  constructor(props) {
    super(props)
    const { totalItems, maxItemsPerPage, maxPagesToShow } = this.props
    this.state = {
      startingPage: 1,
      numberOfPages: Math.ceil(totalItems / maxItemsPerPage),
      startingPageOffset: Math.floor(maxPagesToShow / 2),
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.maxItemsPerPage !== nextProps.maxItemsPerPage) {
      this.setState({ numberOfPages: Math.ceil(nextProps.totalItems / nextProps.maxItemsPerPage) })
    }
  }

  setPage(nextPage) {
    const startingPage = Math.max(
      Math.min(nextPage - this.state.startingPageOffset, this.state.numberOfPages - this.props.maxPagesToShow + 1),
      1
    )
    this.setState({ startingPage }, () => {
      // call change page function in parent component
      this.props.onChange(nextPage)
    })
  }

  createPagesLink(numberOfPages, currentPage, startingPage) {
    const pagesToShow = Math.min(this.props.maxPagesToShow, numberOfPages)
    const pageRange = new Array(pagesToShow).fill(null)
    return pageRange.map((x, index) => {
      const pageNumber = index + startingPage
      const isCurrentPage = pageNumber === currentPage
      return (
        <li
          className="iw-pagination__page qa-pagination__page"
          key={pageNumber}
          onClick={() => this.setPage(pageNumber)}
        >
          {isCurrentPage ? (
            <strong className="iw-pagination__page-link iw-pagination__page-link--current qa-pagination__page-link--current">
              {pageNumber}
            </strong>
          ) : (
            <IWAnchor className="iw-pagination__page-link">{pageNumber}</IWAnchor>
          )}
        </li>
      )
    })
  }

  render() {
    const { numberOfPages, startingPage } = this.state
    const { currentPage } = this.props
    return (
      <div>
        {numberOfPages > 1 && (
          <ul className="iw-pagination qa-pagination">
            <li
              className={cn(
                { invisible: currentPage < 3 },
                'iw-pagination__page iw-pagination__page--first qa-pagination__page--first'
              )}
              onClick={() => this.setPage(1)}
            >
              <IWAnchor className="iw-pagination__page-link iw-pagination__page-link--first">{'<<'}</IWAnchor>
            </li>
            <li
              className={cn(
                { invisible: currentPage < 2 },
                'iw-pagination__page iw-pagination__page--previous qa-pagination__page--previous'
              )}
              onClick={() => this.setPage(currentPage - 1)}
            >
              <IWAnchor className="iw-pagination__page-link iw-pagination__page-link--previous">
                {'<'} {t('Previous')}
              </IWAnchor>
            </li>

            {this.createPagesLink(numberOfPages, currentPage, startingPage)}
            <li
              className={cn(
                { invisible: !(currentPage < numberOfPages) },
                'iw-pagination__page iw-pagination__page--next qa-pagination__page--next'
              )}
              onClick={() => this.setPage(currentPage + 1)}
            >
              <IWAnchor className="iw-pagination__page-link iw-pagination__page-link--next">
                {t('Next')} {'>'}
              </IWAnchor>
            </li>
            <li
              className={cn(
                { invisible: !(currentPage + 1 < numberOfPages) },
                'iw-pagination__page iw-pagination__page--last qa-pagination__page--last'
              )}
              onClick={() => this.setPage(numberOfPages)}
            >
              <IWAnchor className="iw-pagination__page-link iw-pagination__page-link--last">{'>>'}</IWAnchor>
            </li>
          </ul>
        )}
      </div>
    )
  }
}

IWPagination.defaultProps = {
  maxPagesToShow: 5,
}

IWPagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  maxItemsPerPage: PropTypes.number.isRequired,
  maxPagesToShow: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  totalItems: PropTypes.number.isRequired,
}
