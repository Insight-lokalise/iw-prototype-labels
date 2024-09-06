import axios from 'axios'

export default function getSubmissionForm(materialId) {
  return axios.post('/insightweb/submissionForm', materialId)
    .catch(error => {
      console.warn('Failed to load submission form')
      throw error
    })
}
