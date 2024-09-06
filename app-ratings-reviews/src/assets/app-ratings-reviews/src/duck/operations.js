import {
  getRatingsAndReviews,
  getSubmissionForm,
  getTranslations,
} from '../api/us'
import {
  getRatingsAndReviewsSuccess,
  getRatingsAndReviewsFailure,
  getReviewSubmissionFormSuccess,
  getReviewSubmissionFormFailure,
  saveLastResponse,
  getRatingsAndReviewsOnSortSuccess,
} from './actions'
import { selector_reviewFilters } from './selectors'
import {
  GET_RnR_SUCCESS,
  GET_RnR_SORT_SUCCESS,
  GET_USERDATA,
  SAVE_USERDATA,
} from './types'

export function getRatingsAndReviewsListOnSort(filters) {
  const serialized = JSON.stringify(filters)
  return (dispatch, getState) => {
    const reviewFilter = selector_reviewFilters(getState())
    const reviewSorting = reviewFilter[serialized]
    if (reviewSorting) {
      return Promise.resolve(
        dispatch({
          type: GET_RnR_SORT_SUCCESS,
          payload: { ...reviewSorting, sortBy: filters.sortBy },
        })
      )
    }
    return getRatingsAndReviews(filters)
      .then(({ data }) => {
        dispatch(
          getRatingsAndReviewsOnSortSuccess({ ...data, sortBy: filters.sortBy })
        )
        dispatch(
          saveLastResponse(serialized, { ...data, sortBy: filters.sortBy })
        )
      })
      .catch((data) => {
        dispatch(getRatingsAndReviewsFailure(data))
      })
  }
}

export function getRatingsAndReviewsList(filters) {
  const serialized = JSON.stringify(filters)
  return (dispatch, getState) => {
    const reviewFilter = selector_reviewFilters(getState())
    const reviewSorting = reviewFilter[serialized]
    if (reviewSorting) {
      return Promise.resolve(
        dispatch({
          type: GET_RnR_SUCCESS,
          payload: { ...reviewSorting, sortBy: filters.sortBy },
        })
      )
    }
    return getRatingsAndReviews(filters)
      .then(({ data }) => {
        dispatch(
          getRatingsAndReviewsSuccess({ ...data, sortBy: filters.sortBy })
        )
        dispatch(
          saveLastResponse(serialized, { ...data, sortBy: filters.sortBy })
        )
      })
      .catch((data) => {
        dispatch(getRatingsAndReviewsFailure(data))
      })
  }
}

export function getReviewSubmissionForm(materialId) {
  return (dispatch) =>
    getSubmissionForm(materialId)
      .then((data) => {
        dispatch(getReviewSubmissionFormSuccess(data))
      })
      .catch((data) => {
        dispatch(getReviewSubmissionFormFailure(data))
      })
}

/**
 * Gets userData from JSP after waiting for it to be fully populated
 * @param  {Object}   userObject window.Insight
 * @return {Action}
 */
export function getUserData(userObject) {
  return (dispatch) => {
    getTranslations().then(() => {
      dispatch({ type: GET_USERDATA })
      dispatch(saveUserData(userObject))
    })
  }
}
/**
 * Save relevant user permissions
 * @param  {Object} userObject window.Insight when fully populated
 * @return {Action}
 */
function saveUserData(userObject) {
  const { isLoggedin, b2bLoginInfo, userInformation } = userObject
  return {
    type: SAVE_USERDATA,
    payload: { isLoggedin, b2bLoginInfo, userInformation },
  }
}
