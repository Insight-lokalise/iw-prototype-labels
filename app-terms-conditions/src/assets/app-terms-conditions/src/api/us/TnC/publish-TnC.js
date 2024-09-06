import { BASE_URL, requestDefaultHeaders } from '@constants'

export async function publishDeleteTnCData(isPublish, termId, revisionId) {
  try {
    const response = await fetch(`${BASE_URL}/tc/v1/term/${termId}/revision/${revisionId}`, {
      headers: requestDefaultHeaders,
      method: isPublish ? 'PUT' : 'DELETE'
    })
    const isSuccessful = response.ok
    const data = await (isSuccessful ? response.json() : response.text())
    return { data, success: isSuccessful }
  } catch (err) {
    return { data: err, success: false }
  }
}
