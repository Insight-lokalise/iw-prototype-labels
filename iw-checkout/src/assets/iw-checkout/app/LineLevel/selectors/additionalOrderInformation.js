import ROUTES from '../../../libs/routes'
import { selector_additionalInformation } from './lineLevelView'

export const selector_hasAdditionalOrderInformation = (state) =>
  selector_hasHeaderLevelSmartTrackers(state) ||
  selector_hasSharedUserFields(state) ||
  selector_hasWarrantyFields(state) ||
  selector_hasLabConfigurationNotes(state) ||
  selector_hasInvoiceNotes(state) ||
  selector_hasFileUpload(state) ||
  selector_hasAdditionalOrderNotes(state)
export const selector_hasAdditionalOrderNotes = (state) =>
  selector_populateUIFlags(state).additionalOrderNotes || false
export const selector_hasContractReportingFields = (state) =>
  selector_populateUIFlags(state).contractReportingFields || false
export const selector_hasCountryOfUsage = (state) =>
  selector_populateUIFlags(state).countryOfUsage || false
export const selector_hasDiversityPartner = (state) =>
  selector_populateUIFlags(state).diversityPartner || false
export const selector_hasFileUpload = (state) =>
  selector_populateUIFlags(state).fileUpload || false
export const selector_hasHeaderLevelSmartTrackers = (state) =>
  selector_populateUIFlags(state).headerLevelSmartTrackers || false
export const selector_hasInvoiceNotes = (state) =>
  selector_populateUIFlags(state).invoiceNotes || false
export const selector_hasLabConfigurationNotes = (state) =>
  selector_populateUIFlags(state).labConfigNotes || false
export const selector_hasLicenseContact = (state) =>
  selector_populateUIFlags(state).licenseContact || false
export const selector_hasLineLevelInformation = (state) =>
  selector_hasLineLevelSmartTrackers(state) ||
  selector_hasContractReportingFields(state) ||
  selector_hasCountryOfUsage(state) ||
  selector_hasDiversityPartner(state) ||
  selector_hasSellRequirements(state)
export const selector_hasLineLevelPage = (state) =>
  selector_populateUIFlags(state).redirectURL === ROUTES.LINE_LEVEL
export const selector_hasLineLevelSmartTrackers = (state) =>
  selector_populateUIFlags(state).lineLevelSmartTrackers || false
export const selector_hasPopulateUIFlags = (state) =>
  Object.keys(selector_additionalInformation(state).populateUIFlags).length > 0
export const selector_hasSellRequirements = (state) =>
  selector_populateUIFlags(state).sellRequirements || false
export const selector_hasSharedUserFields = (state) =>
  selector_populateUIFlags(state).sharedUserFields ||
  selector_populateUIFlags(state).limitedUser ||
  false
export const selector_hasTaxOverride = (state) =>
  selector_populateUIFlags(state).taxOverride || false
export const selector_hasWarrantyFields = (state) =>
  selector_populateUIFlags(state).warrantyContact || false
export const selector_headerLevelSmartTrackers = (state) =>
  selector_additionalInformation(state).headerLevelSmartTrackers
export const selector_isLimitedUser = (state) =>
  selector_populateUIFlags(state).limitedUser || false
export const selector_isRequisition = (state) =>
  selector_populateUIFlags(state).requisition || false
export const selector_isSingleSoldTo = (state) =>
  selector_populateUIFlags(state).singleSoldTo || false
export const selector_isSingleWebGroup = (state) =>
  selector_populateUIFlags(state).singleWebGroup || false
export const selector_billingCountry = (state) =>
  selector_populateUIFlags(state).billingCountry || undefined
export const selector_isCyberSource = (state) =>
  selector_populateUIFlags(state).enableCyberSource || false
export const selector_populateUIFlags = (state) =>
  selector_additionalInformation(state).populateUIFlags
export const selector_shoppingRequestHasShippableItems = (state) =>
  selector_populateUIFlags(state).cartHasShippableItem || false
export const selector_taxExemptionNumber = (state) =>
  selector_populateUIFlags(state).taxExemptionNumber || null
export const selector_showDuns = (state) =>
  selector_populateUIFlags(state)?.showDuns || false
