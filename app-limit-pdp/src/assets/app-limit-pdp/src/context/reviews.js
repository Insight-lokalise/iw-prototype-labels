import React from 'react'
import {
  getProductReviewsState,
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
      }}
    >
      {props.children}
    </ReviewsContext.Provider>
  )
}
