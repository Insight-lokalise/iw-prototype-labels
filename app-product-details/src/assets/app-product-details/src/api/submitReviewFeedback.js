import axios from './axios'

/** Submit Review Feedback
 *
 * Submit feedback for the selected review
 * @param {object} feedback - feedback object data
 * */
export const submitReviewFeedback = (feedback) => {
  try {
    const { data } = axios.post('/insightweb/submitfeedback', feedback)
    return data
  } catch (err) {
    console.warn('Failed to submit feedback')
    throw err
  }
}

export default submitReviewFeedback
