
import { BASE_URL, requestDefaultHeaders } from '@constants'

export async function addTnCData(values, salesArea) {
  try {
    const response = await fetch(`${BASE_URL}/tc/v1/term/${salesArea}`, {
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
