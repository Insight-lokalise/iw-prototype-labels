import axios from './axios'
import { l } from '@insight/toolkit-utils'

/** Submit Review
 *
 * Get the required form fields used to submit a review
 * @param {object} review - review form data
 * */
export const submitReview = async (review) => {
  try {
    const { data } = await axios.post('/insightweb/submitReview', {
      ...review,
      locale: l(),
    })
    return data
  } catch (err) {
    console.warn('Failed to submit review')
    throw err
  }
}

export default submitReview
