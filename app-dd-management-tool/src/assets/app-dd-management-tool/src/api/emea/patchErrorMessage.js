import axios from 'axios'
import { API_ROOT } from './api-config'

const FULL_ERROR_DATA_URL = `${API_ROOT}/management-tool/v1/errors`


export default function patchErrorMessage(id,messagekey,topic,status) {

const errorMessage = {
  key: messagekey,
  topic: topic,
  status: status
}
  return axios
    .patch(`${FULL_ERROR_DATA_URL}/${id}`,
      errorMessage,
      {
        headers: {
          Authorization: window.ddmSecurityConfiguration.updateToken,
          Accept: 'application/json',
        }
      })
    .catch(error => {
      console.warn('Failed to fetch full error data', error)
      throw error
    })
    .then((response) =>   console.log(response) )


}
