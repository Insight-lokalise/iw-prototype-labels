
import { BASE_URL, requestDefaultHeaders } from '@constants'

export async function setDefaultTerm(salesAreaId, termId) {
  try {
    const response = await fetch(`${BASE_URL}/tc/v1/term/default/${salesAreaId}/${termId}`, {
      headers: requestDefaultHeaders,
      method: 'PUT'
    })
    const isSuccessful = response.ok
    const data = await (isSuccessful ? response.json() : response.text())
    return { data, success: isSuccessful }
  } catch (err) {
    return { data: err, success: false }
  }
}

