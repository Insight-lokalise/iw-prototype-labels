import React, { useContext } from 'react'
import { ReviewsListItem } from '../ReviewsListItem/ReviewsListItem'
import { ReviewsContext } from '../../../../context/reviews'

export const ReviewsList = () => {
  const { GET_REVIEWS = {}, submitReviewFeedbackAction } =
    useContext(ReviewsContext)
  const { reviews } = GET_REVIEWS
  if (!reviews || !reviews.length) return null

  const renderReviews = () => {
    return reviews.map((review) => (
      <ReviewsListItem
        key={review.Id}
        review={review}
        brandName={reviews.product?.Brand?.Name}
        categoryId={reviews.product?.CategoryId}
        materialId={reviews.product?.Id}
        submitReviewFeedback={submitReviewFeedbackAction}
      />
    ))
  }
  return <section>{renderReviews()}</section>
}
export default ReviewsList
