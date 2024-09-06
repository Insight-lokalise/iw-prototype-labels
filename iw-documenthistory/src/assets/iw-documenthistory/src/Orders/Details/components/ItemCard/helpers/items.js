import hasValue from '../../CustomerDetailsTab/helpers/smartTrackers'

export function hasLineLevelInformation(
  { contractReportingField, countryOfUsage, smartTracker },
  contractTextLineItem
) {
  return !!(
    (Array.isArray(contractReportingField) && contractReportingField.length > 0) ||
    (Array.isArray(contractTextLineItem) && contractTextLineItem.length > 0) ||
    countryOfUsage ||
    filterSmartTrackers(smartTracker).length > 0
  )
}

export function filterSmartTrackers(smartTracker) {
  return Array.isArray(smartTracker) ? smartTracker.filter(hasValue) : []
}
