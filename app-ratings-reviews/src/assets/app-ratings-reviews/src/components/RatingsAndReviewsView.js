import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Loading } from '@insight/toolkit-react'
import { BvPixelTrackEvent } from '../lib'

import CustomerReviews from '../containers/CustomerReviews'
import ReviewSubmissionModal from './ReviewSubmissionModal'

export default class RatingsAndReviewsView extends Component {
  state = {
    modalIsOpen: false,
  }

  componentDidMount() {
    const { getRatingsAndReviewsList, itemInfo, locale, reviews } = this.props
    const { materialId } = itemInfo
    const param = {
      locale,
      materialId,
      sortBy: 'SubmissionTime:desc,Rating:desc',
      limit: 5,
    }
    if (!(reviews.length > 0)) {
      getRatingsAndReviewsList(param)
    }
  }

  openSubmissionFormModal = () => {
    this.setState({ modalIsOpen: true })
    const { getReviewSubmissionForm, itemInfo, brandName, categoryId } =
      this.props
    const { materialId } = itemInfo
    getReviewSubmissionForm({ materialId })

    BvPixelTrackEvent({
      name: 'write',
      brand: brandName,
      productId: materialId,
      categoryId: categoryId,
      detail1: 'review',
      detail2: 'PrimaryRatingSummary',
    })
  }

  closeModal = () => {
    this.setState({ modalIsOpen: false })
  }

  render() {
    const {
      isLoading,
      itemInfo,
      submissionFormFields,
      locale,
      brandName,
      categoryId,
    } = this.props
    const { modalIsOpen } = this.state
    return (
      <Fragment>
        {isLoading ? (
          <div>
            <Loading className="c-loading c-loading__reviews" />
          </div>
        ) : (
          <div id="c-reviews-tabs">
            <div className="c-reviews-tabs">
              <CustomerReviews
                isLoading={isLoading}
                itemInfo={itemInfo}
                locale={locale}
                openSubmissionFormModal={this.openSubmissionFormModal}
                showMore={this.showMore}
                sortByOptions={this.sortByOptions}
              />
            </div>
            {modalIsOpen && (
              <ReviewSubmissionModal
                closeModal={this.closeModal}
                locale={this.props.locale}
                itemInfo={itemInfo}
                modalIsOpen={modalIsOpen}
                submissionFormFields={submissionFormFields}
                brandName={brandName}
                categoryId={categoryId}
              />
            )}
          </div>
        )}
      </Fragment>
    )
  }
}

RatingsAndReviewsView.propTypes = {
  brandName: PropTypes.string.isRequired,
  categoryId: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  getRatingsAndReviewsList: PropTypes.func.isRequired,
  getReviewSubmissionForm: PropTypes.func.isRequired,
  itemInfo: PropTypes.shape({
    description: PropTypes.string,
    imageURL: PropTypes.string,
    materialId: PropTypes.string,
  }).isRequired,
  locale: PropTypes.string,
  reviews: PropTypes.arrayOf(PropTypes.object),
  submissionFormFields: PropTypes.shape({
    /* key value pairs */
  }),
}

RatingsAndReviewsView.defaultProps = {
  locale: 'en_US',
  reviews: [],
  submissionFormFields: {},
}
