import {
  GET_RnR_SUCCESS,
  GET_RnR_SORT_SUCCESS,
  GET_RnR_FAILURE,
  GET_SUBMISSIONFORM_SUCCESS,
  GET_SUBMISSIONFORM_FAILURE,
  SAVE_LAST_RESPONSE,
  SUBMIT_RnR_SUCCESS,
  SUBMIT_RnR_FAILURE,
} from './types'

export function getRatingsAndReviewsSuccess(data) {
  return {
    type: GET_RnR_SUCCESS,
    payload: data,
  }
}

export function getRatingsAndReviewsOnSortSuccess(data) {
  return {
    type: GET_RnR_SORT_SUCCESS,
    payload: data,
  }
}

export function getRatingsAndReviewsFailure(data) {
  return {
    type: GET_RnR_FAILURE,
    payload: data,
  }
}

export function getReviewSubmissionFormSuccess(data) {
  return {
    type: GET_SUBMISSIONFORM_SUCCESS,
    payload: data,
  }
}

export function getReviewSubmissionFormFailure(data) {
  return {
    type: GET_SUBMISSIONFORM_FAILURE,
    payload: data,
  }
}

export function postRatingsAndReviewsSuccess(data) {
  return {
    type: SUBMIT_RnR_SUCCESS,
    payload: data,
  }
}

export function postRatingsAndReviewsFailure(data) {
  return {
    type: SUBMIT_RnR_FAILURE,
    payload: data,
  }
}

export function saveLastResponse(serialized, data) {
  return {
    type: SAVE_LAST_RESPONSE,
    payload: { [serialized]: data },
  }
}
