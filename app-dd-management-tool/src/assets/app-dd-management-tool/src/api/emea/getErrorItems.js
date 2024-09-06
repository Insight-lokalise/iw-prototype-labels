import axios from 'axios'
import { API_ROOT } from './api-config'

const FULL_ERROR_DATA_URL = `${API_ROOT}/management-tool/v1/errors`


export default function getErrorItems(currentPage,errorsPerPage,sortColumn) {

  return axios
    .get(`${FULL_ERROR_DATA_URL}?page=${currentPage}&size=${errorsPerPage}&sort=${sortColumn}`,
      {
        headers: {
          Authorization: window.ddmSecurityConfiguration.readToken,
          Accept: 'application/json',
        }
      }
    )
    .catch(error => {
      console.warn('Failed to fetch full error data', error)
      throw error
    })
    .then((response) =>   response.data )

}
