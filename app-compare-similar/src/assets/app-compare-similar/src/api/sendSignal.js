import { sendSignal as sendSignalApi } from 'app-api-user-service'
import { getDefaultLoggedOutSalesOrg } from '@insight/toolkit-utils'
import { getSessionUser } from './getSessionUser'

export const sendSignal = async (signalsArray) => {
  if (!signalsArray?.length) return null
  // Get user session info
  const user = await getSessionUser()
  // Get fusion query id from local storage
  const fusionQueryId = window.sessionStorage.getItem('fusionQueryId')
  const signalMetaData = window.sessionStorage.getItem('signalMetaData')
  // Add session data to signals
  const signals = signalsArray.map((param) => ({
    fusionQueryId,
    signalMetaData,
    country: user.locale && user.locale.split('_')[1],
    userId: user.userInformation?.cdmUid,
    salesOrg:
      user.salesOrg || getDefaultLoggedOutSalesOrg(user.locale, user.isIpsLogo),
    sessionId: user.sessionId,
    locale: user.locale,
    ...param,
  }))
  // Send signal
  sendSignalApi(signals)
}

export default sendSignal
