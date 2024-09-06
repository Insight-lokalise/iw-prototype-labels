import { BASE_URL, requestDefaultHeaders } from '@constants'

export async function getSalesAreaData() {
  try {
    const response = await fetch(`${BASE_URL}/tc/v1/salesareas`, {
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

export async function getSalesAgreement(agreementId) {
  try {
    const response = await fetch(`${BASE_URL}/tc/v1/term/agreement/${agreementId}`, {
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

export async function saveAgreements(revisionId, agreements){
  try {
    const response = await fetch(`${BASE_URL}/tc/v1/term/updateAgreement/${revisionId}`, {
      body: formatRequest(agreements),
      headers: requestDefaultHeaders,
      method: 'POST'
    })
    const isSuccessful = response.ok
    const data = await (isSuccessful ? response.json() : response.text())
    return { data, success: isSuccessful }
  } catch (err) {
    return { data: err, success: false }
  }
}

function formatRequest(data) {
  return JSON.stringify(data)
}
