import { combineReducers } from 'redux'

import { ratingsAndReviewsReducer, reviewFilterReducer, submissionFormReducer, userData } from '../duck'

export default function createRootReducer() {
  return combineReducers({
    reviews: ratingsAndReviewsReducer,
    reviewFilters: reviewFilterReducer,
    submissionForm: submissionFormReducer,
    user: userData,
  })
}
