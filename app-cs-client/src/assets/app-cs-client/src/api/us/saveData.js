import axios from './axiosConfig'

export function putPin(id) {
  return axios({
    method: 'post',
    url: `cs/pin/${id}`
  }).catch(error => {
    console.warn(`Failed to save pinned item`, error)
    throw error
  })
}

export function putUserSettings(settings) {
  return axios({
    method: 'post',
    url: `cs/userSettings`,
    data: settings,
  }).catch(error => {
    console.warn('Failed to save user settings', error)
    throw error
  })
}
