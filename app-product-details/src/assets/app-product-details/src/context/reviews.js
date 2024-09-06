import React from 'react'
import {
  getProductReviewsState,
  getReviewsSubmissionForm,
} from '../hooks/useReviews'

/** Reviews Context
 * Used to store the state of reviews */
export const ReviewsContext = React.createContext({
  GET_REVIEWS: {
    loading: true,
    error: null,
    limit: null,
    offset: null,
    totalResults: null,
    locale: null,
    reviews: null,
    hasError: null,
    errors: null,
    defaultCount: null,
    totalReviews: null,
    averageRating: null,
    ratingDistribution: null,
    user: null,
  },
  getRatingsAndReviewsList: null,
  getReviewsSubmissionForm: null,
  submitReviewAction: null,
  submitReviewFeedbackAction: null,
})
ReviewsContext.displayName = 'Reviews'

/** Reviews Context Provider
 *
 * Renders the current state of the get product reviews hook and add the response to the context
 * */
export const ReviewsProvider = (props) => {
  const [reviewsState, reviewsActions] = getProductReviewsState()
  return (
    <ReviewsContext.Provider
      value={{
        ...reviewsState,
        ...reviewsActions,
        getReviewsSubmissionForm,
      }}
    >
      {props.children}
    </ReviewsContext.Provider>
  )
}
