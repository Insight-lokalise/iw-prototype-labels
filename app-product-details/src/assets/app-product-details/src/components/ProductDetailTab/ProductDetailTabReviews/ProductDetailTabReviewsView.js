import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'
import { ReviewsAverageRating } from './ReviewsAverageRating/ReviewsAverageRating'
import { ReviewPanelTitle } from './ReviewsPanelTitle/ReviewsPanelTitle'
import { ReviewsStatistics } from './ReviewsStatistics/ReviewsStatistics'
import { ReviewsList } from './ReviewsList/ReviewsList'
import ReviewsFooter from './ReviewsFooter/ReviewsFooter'
import ReviewsLeaveReview from './ReviewsLeaveReview/ReviewsLeaveReview'
import { PDPContext, ReviewsContext } from '../../../context'

export const ProductDetailTabReviewsView = ({ openSubmissionFormModal }) => {
  const { getReviewsListAction } = useContext(ReviewsContext)
  const { product } = useContext(PDPContext)

  const [state, setState] = useState({
    limit: 5,
    rating: 0,
    sortBy: 'SubmissionTime:desc',
  })

  // Show more reviews if total reviews is greater than limit
  const showMore = (count) => {
    setState({ ...state, limit: count })
    const { rating } = state
    const param = {
      materialId: product?.materialId,
      sortBy: state.sortBy,
      limit: count,
      ...(rating > 0 && { rating }),
    }
    getReviewsListAction(param)
  }
  // Sort review by value
  const sortByOptions = (value) => {
    setState({ ...state, sortBy: value, rating: 0 })
    const param = {
      materialId: product?.materialId,
      sortBy: value,
      limit: 5,
    }
    getReviewsListAction(param)
  }
  // Filter reviews using the selected star count
  const filterReviews = (starCount) => {
    setState({ ...state, rating: starCount })
    const param = {
      materialId: product?.materialId,
      sortBy: state.sortBy,
      limit: state.limit,
      rating: starCount,
    }
    getReviewsListAction(param)
  }
  return (
    <div className="c-reviews">
      <ReviewsLeaveReview openSubmissionFormModal={openSubmissionFormModal} />
      <ReviewsAverageRating onClick={() => filterReviews(null)} />
      <ReviewsStatistics filterReviews={filterReviews} />
      <ReviewPanelTitle sort={state.sortBy} onSort={sortByOptions} />
      <ReviewsList />
      <ReviewsFooter showMore={showMore} />
    </div>
  )
}

ProductDetailTabReviewsView.propTypes = {
  openSubmissionFormModal: PropTypes.func.isRequired,
}

export default ProductDetailTabReviewsView
