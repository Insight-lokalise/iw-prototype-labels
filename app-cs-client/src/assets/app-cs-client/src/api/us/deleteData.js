import axios from './axiosConfig'

export function deletePin(id) {
  return axios({
    method: 'delete',
    url: `cs/pin/${id}`
  }).catch(error => {
    console.warn(`Failed to delete unPinned item`, error)
    throw error
  })
}


