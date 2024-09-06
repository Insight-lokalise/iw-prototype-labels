import { alert } from '../../constants'

export function getUsageFlag(lastUsageResponse){
  const usageFlag = lastUsageResponse && lastUsageResponse.previousZeroUsage != null && lastUsageResponse.isComplete && lastUsageResponse.iszeroUsage
  return usageFlag
}

export function retrieveLastUsagePeriod(openCloseModal, reportUsageText){
  return openCloseModal(reportUsageText, alert, true)
}
