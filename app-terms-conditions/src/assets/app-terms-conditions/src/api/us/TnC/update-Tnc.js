
import { BASE_URL, requestDefaultHeaders } from '@constants'

export async function updateTnCData(values, termObj) {
  try {
    const response = await fetch(`${BASE_URL}/tc/v1/term/${termObj.termId}/revision/${termObj.revisionId}`, {
      body: formatRequest(values),
      headers: requestDefaultHeaders,
      method: 'POST'
    })
    const isSuccessful = response.ok
    return { data: {}, success: isSuccessful }
  } catch (err) {
    return { data: err, success: false }
  }
}

function formatRequest(data) {
  return JSON.stringify(data)
}
