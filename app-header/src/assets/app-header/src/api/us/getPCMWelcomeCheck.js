import axios from 'axios'

let checked = false
let cachedResponse
const PCM_CHECK_URL = '/insightweb/pcm/welcome?username='

export default function getPCMWelcomeCheck(username) {
  if (!checked) {
    checked = true
    const timestamp = new Date().getTime()
    cachedResponse = axios
    .get(`${PCM_CHECK_URL}${username}&${timestamp}`)
    .catch(error => {
      console.warn('Failed to fetch pcm welcome check', error)    
      return null
    })
  }

  return cachedResponse
}
