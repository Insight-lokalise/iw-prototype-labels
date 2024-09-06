import {
  setSessionStorage,
  getSessionStorage,
} from '@insight/toolkit-utils/lib/helpers/sessionStorageHelper'
import {CARD_SCREEN_INFO} from "../constants";

export function rewrite(str) {
  const properCase = str[0].toUpperCase() + str.substr(1).toLowerCase()
  const output = properCase.split('_')

  if (str.endsWith('_NO')) {
    output[output.length - 1] = '#'
  } else if (str.endsWith('_ID')) {
    output[output.length - 1] = 'ID'
  }
  return output.join(' ')
}

export function getLicenseInfo(item){
  if(item){
    const licenseInfo = (
      item.sellRequirements
      && item.sellRequirements.filter(char => !char.name.startsWith('CONTACT_EMAIL_'))
    ) || []
    return licenseInfo
  }else{
    return []
  }
}

export function getRequiredLicenseFields(item, lineLevelInfo){
  const hasLineLevelInfo = !!lineLevelInfo.countryOfUsage || lineLevelInfo.sellRequirements
  const requiredLineLevelFields = hasLineLevelInfo ? lineLevelInfo.sellRequirements && lineLevelInfo.sellRequirements.filter(info => info.required) : false
  const  hasRequiredLineLevels = hasLineLevelInfo? (!!lineLevelInfo.countryOfUsage ||
    (lineLevelInfo.sellRequirements && lineLevelInfo.sellRequirements.filter(info => info.required)).length > 0) : false
  const hasCountryOfUsage = hasLineLevelInfo? !!lineLevelInfo.countryOfUsage : false
  return { hasCountryOfUsage, hasRequiredLineLevels , materialID: item.materialInfo.materialId, requiredLineLevelFields }
}

export function formInitialValues(items, lineLevelSessionInfos){
  const filterValues =  items.map((item, i) => {
    const lineLevelInfo = item.id === lineLevelSessionInfos[i]?.id ? lineLevelSessionInfos[i] : []
    const licenseInfoCharacteristics = getLicenseInfo(lineLevelInfo)
    const hasLicenseInfoCharacteristics = licenseInfoCharacteristics.length > 0
    const hasCountryOfUsage = lineLevelInfo ? !!lineLevelInfo.countryOfUsage : false
    const hasLicenseInfo = hasLicenseInfoCharacteristics || hasCountryOfUsage
    if(hasLicenseInfo){
      const sellReqValues =  licenseInfoCharacteristics && licenseInfoCharacteristics.map((sellItem) => {
        const { name, value } = sellItem
        return { [`${name}__${lineLevelInfo.id}`]: value }
      })
      const finalObj = {}
      for(let i = 0; i < sellReqValues.length; i++ ) {
        Object.assign(finalObj, sellReqValues[i]);
      }
     return { ...finalObj, [`countryUsage__${lineLevelInfo.id}`]: lineLevelInfo.countryOfUsage}
    }
  })
  return Object.assign({},...filterValues)
}

/**
 * Broadcast a message that an item was added to the cart, which the
 * new React-based header will listen for, in order to update the item
 * count to reflect the newly added item. We should abstract out the
 * details of this communication channel into a separate library, but
 * we're not yet sure what architecture we'll use for cross-component
 * communication. It's being discussed here:
 * https://pmvscentral.atlassian.net/wiki/spaces/FD/pages/163446792
 * @param message
 */
export function updateMiniCart() {
  window.postMessage({ type: 'cart:updated' }, window.location.origin);
}

export const storePaymentInfoForCardScreening = (propsForCardScreening) => {
  const checkoutForCardScreening = getSessionStorage(CARD_SCREEN_INFO)

  let paymentPropsForCardScreening = {
    ...propsForCardScreening,
  }

  if (checkoutForCardScreening) {
    paymentPropsForCardScreening = {
      ...checkoutForCardScreening,
      ...paymentPropsForCardScreening,
    }
  }
  setSessionStorage(CARD_SCREEN_INFO, paymentPropsForCardScreening)
}


