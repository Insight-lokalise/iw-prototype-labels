import { BASE_URL, requestDefaultHeaders } from '@constants'

export async function getTnCData(salesArea) {
  try {
    const response = await fetch(`${BASE_URL}/tc/v1/term/${salesArea}`, {
      headers: requestDefaultHeaders,
      method: 'GET'
    })
    const isSuccessful = response.ok
    const data = await (isSuccessful ? response.json() : response.text())
    return { data, success: isSuccessful }
  } catch (err) {
    return { data: err, success: false }
  }
}
