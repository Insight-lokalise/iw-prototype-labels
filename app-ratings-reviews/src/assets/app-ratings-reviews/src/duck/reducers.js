import {
  GET_RnR_SUCCESS,
  GET_RnR_FAILURE,
  GET_SUBMISSIONFORM_SUCCESS,
  GET_SUBMISSIONFORM_FAILURE,
  GET_USERDATA,
  GET_RnR_SORT_SUCCESS,
  SAVE_LAST_RESPONSE,
  SAVE_USERDATA,
  SUBMIT_RnR_SUCCESS,
  SUBMIT_RnR_FAILURE,
} from './types'

const initialState = {
  isLoading: true,
  hasFailed: false,
  reviewFilters: {}
 }

export function ratingsAndReviewsReducer(state = initialState, { type, payload }) {
  switch (type) {
    case GET_RnR_SUCCESS:
      return {
        hasFailed: false,
        isLoading: false,
        ...payload,
      }
    case GET_RnR_SORT_SUCCESS:{
      const {Results, TotalResults } = payload
      return {
        hasFailed: false,
        isLoading: false,
        ...{...state, Results, TotalResults},
      }

    }
    case GET_RnR_FAILURE:
      return {
        hasFailed: true,
        isLoading: false,
        reviewsError: payload,
      }
    case SUBMIT_RnR_SUCCESS:
      return {
        hasFailed: false,
        isLoading: false,
        payload,
      }
    case SUBMIT_RnR_FAILURE:
      return {
        hasFailed: true,
        isLoading: false,
      }
    default:
      return state
  }
}

export function reviewFilterReducer(state = {}, { type, payload }) {
  switch (type) {
    case SAVE_LAST_RESPONSE:
      return {
        ...state,
        ...payload,
      }
    default:
      return state
  }
}

export function submissionFormReducer(state = {}, { type, payload }) {
  switch (type) {
    case GET_SUBMISSIONFORM_SUCCESS:
      return {
        hasFailed: false,
        isLoading: false,
        ...payload.data,
      }
    case GET_SUBMISSIONFORM_FAILURE:
      return {
        hasFailed: true,
        isLoading: false,
        submissionFormError: payload,
      }
    default:
      return state
  }
}

export function userData(state = { isLoading: true }, action) {
  switch (action.type) {
    case GET_USERDATA: {
      const nextState = { isLoading: true }
      return nextState
    }
    case SAVE_USERDATA: {
      const nextState = action.payload
      return nextState
    }
    default:
      return state
  }
}
