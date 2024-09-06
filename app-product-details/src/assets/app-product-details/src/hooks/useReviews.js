import { useEffect, useState, useReducer } from 'react'
import { useParams } from 'react-router-dom'
import { l } from '@insight/toolkit-utils'
import { getProductReviews } from '../api/getProductReviews'
import { getSessionUser } from '../api/getSessionUser'
import { getSubmissionForm } from '../api/getSubmissionForm'
import { submitReview } from '../api/submitReview'
import { submitReviewFeedback } from '../api/submitReviewFeedback'

/** Initial reviews state */
const initialState = {
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
  GET_REVIEWS_LIST: {
    loading: true,
    error: null,
  },
  getRatingsAndReviewsList: null,
  getReviewsSubmissionForm: null,
  submitReviewAction: null,
  submitReviewFeedbackAction: null,
}

/** Get Reviews
 *
 * Get product reviews and user session action used on mount
 *
 * @param {function} dispatch useReducer dispatch method
 * @returns a function containing the wrapped exec
 */
export const getReviews = (dispatch) => async (params) => {
  try {
    // Dispatch get reviews action type
    dispatch({ type: 'GET_REVIEWS' })
    // Get reviews and current user session
    const [reviews, user] = await Promise.all([
      getProductReviews({ locale: l(), ...params }),
      getSessionUser(),
    ])
    // Dispatch fulfilled get reviews response
    dispatch({ type: 'GET_REVIEWS_FULFILLED', payload: { ...reviews, user } })
  } catch (err) {
    // Dispatch rejected get reviews response
    dispatch({ type: 'GET_REVIEWS_REJECTED', payload: err.message })
  }
}
/** Get Reviews List
 *
 * Get product reviews passing in the filter params
 *
 * @param {function} dispatch useReducer dispatch method
 * */
export const getReviewsList = (dispatch) => async (params) => {
  try {
    // Dispatch get reviews action type
    dispatch({ type: 'GET_REVIEWS_LIST' })
    // Get reviews and current user session
    const reviews = await getProductReviews({ locale: l(), ...params })
    // Dispatch fulfilled get reviews response
    dispatch({ type: 'GET_REVIEWS_LIST_FULFILLED', payload: reviews })
  } catch (err) {
    // Dispatch rejected get reviews response
    dispatch({ type: 'GET_REVIEWS_LIST_REJECTED', payload: err.message })
  }
}

/** Reviews Reducer
 *
 * @param {object} state The current state object
 * @param {object} action The current action with type and payload keys
 * @returns The current state with the resolved action payload
 */
const reviewsReducer = (state, action) => {
  switch (action.type) {
    case 'GET_REVIEWS':
      return {
        ...state,
        GET_REVIEWS: { ...state.GET_REVIEWS, loading: true, error: null },
      }
    case 'GET_REVIEWS_FULFILLED':
      return {
        ...state,
        GET_REVIEWS: {
          ...state.GET_REVIEWS,
          ...action.payload,
          loading: false,
          error: null,
        },
      }
    case 'GET_REVIEWS_REJECTED':
      return {
        ...state,
        GET_REVIEWS: {
          ...state.GET_REVIEWS,
          loading: false,
          error: action.payload,
        },
      }
    case 'GET_REVIEWS_LIST':
      return {
        ...state,
        GET_REVIEWS_LIST: {
          ...state.GET_REVIEWS_LIST,
          loading: true,
          error: null,
        },
      }
    case 'GET_REVIEWS_LIST_FULFILLED':
      return {
        ...state,
        GET_REVIEWS: {
          ...state.GET_REVIEWS,
          ...action.payload,
        },
        GET_REVIEWS_LIST: {
          ...state.GET_REVIEWS_LIST,
          loading: false,
          error: null,
        },
      }
    case 'GET_REVIEWS_LIST_REJECTED':
      return {
        ...state,
        GET_REVIEWS_LIST: {
          ...state.GET_REVIEWS_LIST,
          loading: false,
          error: action.payload,
        },
      }
    default:
      return state
  }
}

/** Get Product Reviews State
 *
 * @returns an array container the reviews state and actions
 */
export const getProductReviewsState = () => {
  const [reviewsState, dispatch] = useReducer(reviewsReducer, initialState)

  const getReviewsAction = getReviews(dispatch)
  const getReviewsListAction = getReviewsList(dispatch)

  const reviewsActions = {
    getReviewsAction,
    getReviewsListAction,
    submitReviewAction: submitReview,
    submitReviewFeedbackAction: submitReviewFeedback,
  }

  return [reviewsState, reviewsActions]
}

/** Get Review Submission Form Hook
 *
 * Get review form fields for validation
 * @param {array=} deps - Optional dependencies to pass to useEffect
 * */
export const getReviewsSubmissionForm = (deps = []) => {
  const [{ data, loading, error }, setReviews] = useState({
    data: null,
    loading: true,
    error: null,
  })
  const { materialId } = useParams()

  const fetchReviewsSubmissionForm = async () => {
    try {
      const form = await getSubmissionForm({ materialId })
      setReviews({ data: form, loading: false, error: null })
    } catch (err) {
      setReviews({ data: null, loading: false, error: err.message })
    }
  }
  useEffect(() => {
    fetchReviewsSubmissionForm()
  }, [...deps, materialId])

  return [data, loading, error]
}

export default {
  getProductReviewsState,
  getReviewsSubmissionForm,
}
