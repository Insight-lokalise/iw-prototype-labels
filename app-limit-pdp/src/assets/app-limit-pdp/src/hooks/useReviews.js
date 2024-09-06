import { useReducer } from 'react'
import { getProductReviews } from '../api/getProductReviews'

/** Initial reviews state */
const initialState = {
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
  GET_REVIEWS_LIST: {
    loading: true,
    error: null,
  },
  getRatingsAndReviewsList: null,
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
    const reviews = await getProductReviews({ ...params })
    // Dispatch fulfilled get reviews response
    dispatch({ type: 'GET_REVIEWS_FULFILLED', payload: { ...reviews } })
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
    const reviews = await getProductReviews({ ...params })
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
  }

  return [reviewsState, reviewsActions]
}

export default {
  getProductReviewsState,

}
