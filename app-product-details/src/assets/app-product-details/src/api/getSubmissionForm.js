import axios from './axios'

/** Get Submission Form
 *
 * Get the required form fields used to submit a review
 * @param {string} materialId - Unique product id
 * */
export const getSubmissionForm = async (materialId) => {
  try {
    const { data } = await axios.post('/insightweb/submissionForm', materialId)
    return data
  } catch (err) {
    console.warn('Failed to load submission form')
    throw err
  }
}

export default getSubmissionForm
