import React, { useState, useContext } from 'react'
import { useParams } from 'react-router-dom';
import { t } from "@insight/toolkit-utils/lib/labels";
import { ReviewsAverageRating } from './ReviewsAverageRating/ReviewsAverageRating'
import { ReviewPanelTitle } from './ReviewsPanelTitle/ReviewsPanelTitle'
import { ReviewsStatistics } from './ReviewsStatistics/ReviewsStatistics'
import { ReviewsList } from './ReviewsList/ReviewsList'
import ReviewsFooter from './ReviewsFooter/ReviewsFooter'
import { PDPContext, ReviewsContext } from '../../../context'

export const ProductDetailTabReviewsView = () => {
  const { getReviewsListAction, GET_REVIEWS = {} } = useContext(ReviewsContext)
  const { product } = useContext(PDPContext)
  const{ locale } = useParams()

  if (!GET_REVIEWS.totalReviews) return (
    <div>
      <div className='c-reviews__header-none'>{t('Customer reviews')}</div>
      <div>{t('No reviews yet.')}</div>
    </div>
  )

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
      locale
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
      locale
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
      locale
    }
    getReviewsListAction(param)
  }
  return (
    <div className="c-reviews">
      <ReviewsAverageRating onClick={() => filterReviews(null)} />
      <ReviewsStatistics filterReviews={filterReviews} />
      <ReviewPanelTitle sort={state.sortBy} onSort={sortByOptions} />
      <ReviewsList />
      <ReviewsFooter showMore={showMore} />
    </div>
  )
}

export default ProductDetailTabReviewsView
