import msgBox from './../../../../libs/iw-components/iw-messageBox'
import { t } from '@insight/toolkit-utils/lib/labels'

const reportableNonReportableText =
  'In order to report usage please remove items that do not apply to the selected service provider.'
const cloudCartText = 'User is not authorized to purchase cloud products.'
const vsppContractAndRequestorText =
  'You require approval to place orders, however this licensing program does not allow approval routing. Please contact vspprogram@insight.com for assistance.'
const usagePeriodReportableAndRequestorText =
  'You require approval to place orders, however this licensing program does not allow approval routing. Please contact spprograms@insight.com for assistance.'
const requestorAndNoRequestorGroupsText =
  'You may not continue with this process because you require approval but are not set up with an approval group. Please contact your account admin or account executive for assistance.'
const buyingIsNotEnabledText =
  'Buying is not enabled. Please contact your account representative.'
const coiCsiText =
  'Client owned/client supplied inventory pricing will be updated by your Insight account representative during order processing.'
const internationalFreightFeesText = `International Freight fees will apply to this order. Totals are therefore showing as 'Estimated' and may be adjusted upon order receipt.`
const directBillableItemsText =
  "Insight's system indicates that a separate agreement with the publisher is required for the procurement of these software items. Please contact your insight account executive for more information."
const invalidMaterialText =
  'The following part number you entered could not be found:'
const invalidMaterialsText =
  'The following part numbers you entered could not be found:'

const error = 'error'
const warn = 'warn'
const info = 'info'

export function processShoppingCartMessages(props) {
  const {
    isCES,
    isLoggedIn,
    hasBuyPermission,
    userRequiresApproval,
    numberOfRequestorGroups,
    hasUsagePeriodReportableNonReportable,
    isCloudCart,
    hasVSPPContract,
    contractUsagePeriodReportable,
    hasCoiOrCsi,
    hasItemsInCart,
    hasDirectBillableItems,
    hasInvalidMaterials,
    hasOutOfStockItems,
    hasQtyExceedsStockCartItems,
    invalidCESParts,
    arrayOfInvalidMaterialObjects,
    hasInternationalFreightFees,
    isStockAndPriceDisplayDisabled,
    isLoggedOutDefaultUser,
  } = props

  if (hasUsagePeriodReportableNonReportable) {
    msgBox.addMsg('shopping-cart', {
      text: t(reportableNonReportableText),
      msgId: 'reportableNonReportable',
      severity: error,
    })
  } else {
    msgBox.removeMsg('shopping-cart', 'reportableNonReportable')
  }

  if (userRequiresApproval && isCloudCart) {
    msgBox.addMsg('shopping-cart', {
      text: t(cloudCartText),
      msgId: 'cloudCart',
      severity: error,
    })
  } else {
    msgBox.removeMsg('shopping-cart', 'cloudCart')
  }

  if (userRequiresApproval && hasVSPPContract) {
    msgBox.addMsg('shopping-cart', {
      text: t(vsppContractAndRequestorText),
      msgId: 'vsppContractAndRequestor',
      severity: error,
    })
  } else {
    msgBox.removeMsg('shopping-cart', 'vsppContractAndRequestor')
  }

  if (userRequiresApproval && contractUsagePeriodReportable) {
    msgBox.addMsg('shopping-cart', {
      text: t(usagePeriodReportableAndRequestorText),
      msgId: 'usagePeriodReportableAndRequestor',
      severity: error,
    })
  } else {
    msgBox.removeMsg('shopping-cart', 'usagePeriodReportableAndRequestor')
  }

  if (!isStockAndPriceDisplayDisabled && hasCoiOrCsi && hasItemsInCart) {
    msgBox.addMsg('shopping-cart', {
      text: t(coiCsiText),
      msgId: 'coiOrCsi',
      severity: info,
    })
  } else {
    msgBox.removeMsg('shopping-cart', 'coiOrCsi')
  }

  if (isLoggedIn && userRequiresApproval && numberOfRequestorGroups === 0) {
    msgBox.addMsg('shopping-cart', {
      text: t(requestorAndNoRequestorGroupsText),
      msgId: 'requestor-group-required',
      severity: error,
    })
  } else {
    msgBox.removeMsg('shopping-cart', 'requestor-group-required')
  }

  if (isLoggedIn && !hasBuyPermission && !userRequiresApproval) {
    msgBox.addMsg('shopping-cart', {
      text: t(buyingIsNotEnabledText),
      msgId: 'buy-not-enabled',
      severity: error,
    })
  } else {
    msgBox.removeMsg('shopping-cart', 'buy-not-enabled')
  }

  if (hasInvalidMaterials) {
    const invalidDEPMaterialObjects = arrayOfInvalidMaterialObjects.filter(
      (item) => item.enrollable
    )
    const invalidNonDEPMaterialObjects = arrayOfInvalidMaterialObjects.filter(
      (item) => !item.enrollable
    )

    if (invalidNonDEPMaterialObjects.length > 0) {
      const numberOrNumbers =
        invalidNonDEPMaterialObjects.length > 1
          ? invalidMaterialsText
          : invalidMaterialText
      const invalidMaterialIDsText = invalidNonDEPMaterialObjects
        .map((invalidMaterialObject) => invalidMaterialObject.materialID)
        .join(', ')
      const invalidMaterialMsg = `${t(
        numberOrNumbers
      )} ${invalidMaterialIDsText}. ${t(
        'Please contact your account executive for further information.'
      )}`

      msgBox.addMsg('shopping-cart', {
        text: invalidMaterialMsg,
        msgId: 'invalidMaterial',
        severity: error,
      })
    } else {
      msgBox.removeMsg('shopping-cart', 'invalidMaterial')
    }

    if (invalidDEPMaterialObjects.length > 0) {
      const DEPMaterialText = t(
        'DEP services can be configured on the cart. The service cannot be added as a single part. Please add the desired part and proceed to the cart to configure DEP.'
      )
      msgBox.addMsg('shopping-cart', {
        text: t(DEPMaterialText),
        msgId: 'DEPMaterial',
        severity: warn,
      })
    } else {
      msgBox.removeMsg('shopping-cart', 'DEPMaterial')
    }
  } else {
    msgBox.removeMsg('shopping-cart', 'invalidMaterial')
    msgBox.removeMsg('shopping-cart', 'DEPMaterial')
  }

  if (hasInternationalFreightFees) {
    msgBox.addMsg('shopping-cart', {
      text: t(internationalFreightFeesText),
      msgId: 'internationalFreightFees',
      severity: info,
    })
  } else if (
    !hasInternationalFreightFees ||
    (hasInternationalFreightFees && !hasItemsInCart)
  ) {
    msgBox.removeMsg('shopping-cart', 'internationalFreightFees')
  }

  if (hasDirectBillableItems) {
    msgBox.addMsg('shopping-cart', {
      text: t(directBillableItemsText),
      msgId: 'directBillableItems',
      severity: error,
    })
  } else {
    msgBox.removeMsg('shopping-cart', 'directBillableItems')
  }

  if (
    (isCES || isLoggedOutDefaultUser) &&
    invalidCESParts &&
    invalidCESParts.length
  ) {
    const removedIds = invalidCESParts.join(', ')

    const invalidPartsMessage = `${t(
      'There was an issue with one or more item(s) in your cart. The following parts have been removed:'
    )} ${removedIds}. ${t('Please contact your support team for assistance.')}`

    msgBox.addMsg('shopping-cart', {
      text: t(invalidPartsMessage),
      msgId: 'invalidCESParts',
      severity: error,
    })
  } else {
    msgBox.removeMsg('shopping-cart', 'invalidCESParts')
  }
}
