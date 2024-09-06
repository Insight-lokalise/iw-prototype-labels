import axios from 'axios'
import { windowRedirect } from '../common/util'

// legacy pages are implemented using soldtoNumber as the key rather than id
export default function switchAccount({ id, soldtoNumber }) {
  const timestamp = new Date().getTime()
  return axios
    .get(`/insightweb/endUser/changeSoldTo/${id || soldtoNumber}/${timestamp}`)
    .catch(error => {
      console.warn('Failed to change account', error)
      throw error
    })
    .then(({ data }) => ({ redirectURL: data.redirectUrl }))
    .then(windowRedirect)
}
