import axios from 'axios'

const JOB_TITLE_DATA_URL = '/insightweb/login/getTitleFieldValues?_='

let cachedResponse

export function getJobTitles(forceRefresh) {
  if (!cachedResponse || forceRefresh) {
    const timestamp = new Date().getTime()
    cachedResponse = axios
      .get(`${JOB_TITLE_DATA_URL}${timestamp}`)
      .catch(error => {
        console.warn('Failed to fetch job title data', error)
        throw error
      })
      .then(({ data }) => {
        return Object.keys(data).reduce((acc, key) => acc.concat({ value: key, text: data[key]}), [])
      })
  }

  return cachedResponse
}
