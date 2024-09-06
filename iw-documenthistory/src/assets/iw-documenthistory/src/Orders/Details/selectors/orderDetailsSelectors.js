/* eslint camelcase: 0 */
import get from 'lodash/get'
import groupBy from 'lodash/groupBy'
import keyBy from 'lodash/keyBy'
import { createSelector } from 'reselect'

import {
  filterAndGroupByBundleId,
  isBundlePart,
  isContractItem,
  isContractPart,
  isStandaloneBundlePart,
  isStandaloneItem,
} from '../components/helpers'
import hasValue from '../components/CustomerDetailsTab/helpers/smartTrackers'

const selector_order = state => get(state, ['orderDetail', 'order'], {})
const selector_shoppingReq = state => get(selector_order(state), 'shoppingRequest', {})
const selector_orderMetadata = state => get(selector_shoppingReq(state), 'orderMetaData', {})
export const selector_insight = state => state.insight || {}
export const selector_accountName = state => get(selector_order(state), 'accountName', '')
export const selector_enrollmentNumber = state => get(selector_order(state), 'enrollmentNumber', null)
export const selector_reportUsage = state => get(selector_order(state), 'reportUsage', null)

export const selector_orderStatus = state => get(selector_order(state), 'orderStatus', 'On hold')

export const selector_salesDocumentNumber = state => get(selector_shoppingReq(state), 'salesDocumentNumber', null)
export const selector_creditStatus = state => get(selector_order(state), 'creditStatus', '')
export const selector_paymentType = state => get(selector_order(state), 'paymentType', '')
export const selector_lineItemStatusList = state => get(selector_order(state), 'lineItemStatusList', [])

/**
 * This selector maps lineItemStatusList by sapLineItemNumber.
 * @returns { Object }
 */
export const selector_lineItemStatusInfoSAPNumberMap = createSelector(selector_lineItemStatusList, lineItemStatusList =>
  keyBy(lineItemStatusList, 'sapLineItemNumber')
)

export const selector_orderSummary = state => get(selector_shoppingReq(state), ['cart', 'summary'], {})
export const selector_soldToCurrency = state => get(selector_shoppingReq(state), ['soldTo', 'currency'], 'USD')
export const selector_webReferenceNumber = state => get(selector_shoppingReq(state), 'webReferenceNumber', null)
export const selector_createdOn = state => get(selector_shoppingReq(state), 'createdOn', 0)
export const selector_isOlderThan90Days = createSelector(selector_createdOn, createdOn => {
  const ninetyDays = 7776000000

  const today = +new Date()
  return createdOn < today - ninetyDays
})
export const selector_shippingAddress = state => get(selector_shoppingReq(state), ['shipping', 'address'], {})
export const selector_shippingCompany = state => get(selector_shoppingReq(state), ['shipping', 'companyName'], '')
export const selector_shippingAttn = state => get(selector_shoppingReq(state), ['shipping', 'attentionLine'], '')
export const selector_isShipComplete = state => get(selector_shoppingReq(state), ['shipping', 'shipComplete'], false)
export const selector_carrierOption = state => get(selector_shoppingReq(state), ['shipping', 'carrier', 'option']) 

/**
 * ----------------------------
 *  Order Details Tab Selectors
 * ----------------------------
 */
const selector_pristineCartItems = state => get(selector_shoppingReq(state), ['cart', 'cartItems'], [])
export const selector_isSEWP = createSelector(
  state => get(selector_shoppingReq(state), ['user', 'userSessionType'], ''),
  userSessionType => userSessionType === 'SEWP'
)

export const selector_isLab = createSelector(selector_pristineCartItems, cartItems => cartItems.some(isBundlePart))
export const selector_serialNumbers = createSelector(selector_pristineCartItems, cartItems =>
  cartItems.reduce((acc, item) => {
    const itemTrackingInfo = item.lineItemTrackingInfo || []
    if (!itemTrackingInfo.length) return acc
    return acc.concat(
      itemTrackingInfo.map(trackingInfo => `${trackingInfo.trackingNumber};${trackingInfo.carrierName}`)
    )
  }, [])
)

export const selector_carrierNames = createSelector(selector_pristineCartItems, cartItems => cartItems.reduce((acc, item) => {
  const itemTrackingInfo = item.lineItemTrackingInfo || []
  if(!itemTrackingInfo) return acc;
  return acc.concat(
    itemTrackingInfo.map(trackingInfo => trackingInfo.carrierName)
  )
}, []))

const selector_standaloneItems = createSelector(selector_pristineCartItems, cartItems =>
  cartItems.filter(isStandaloneItem).map(item => ({ type: 'item', data: item }))
)
const selector_standaloneBundles = createSelector(selector_pristineCartItems, cartItems => {
  const groupedBundleItems = groupBy(cartItems.filter(isStandaloneBundlePart), item => item.bundle.sapLineItemNumber)
  return Object.values(groupedBundleItems).map(bundle => ({
    type: 'bundle',
    data: bundle,
  }))
})
const selector_unStructuredContracts = createSelector(selector_pristineCartItems, cartItems => {
  const contractParts = groupBy(cartItems.filter(isContractPart), item => item.contractId)
  const contractData = Object.values(contractParts)
  return contractData.map(contract => {
    // Only one sample is needed to get the contract name.
    const name = contract[0].contractName || ''
    return [name, contract]
  })
})
const selector_contracts = createSelector(selector_unStructuredContracts, unStructuredContracts =>
  unStructuredContracts.map(([name, contract]) => {
    const contractItems = contract.filter(isContractItem).map(item => ({ type: 'item', data: item }))
    const contractBundles = filterAndGroupByBundleId(contract).map(bundle => ({
      type: 'bundle',
      data: bundle,
    }))
    return { type: 'contract', data: [...contractItems, ...contractBundles], name }
  })
)
export const selector_orderDetails = createSelector(
  selector_standaloneItems,
  selector_standaloneBundles,
  selector_contracts,
  (standAloneItems, standAloneBundles, contracts) =>
    [...standAloneItems, ...standAloneBundles, ...contracts].map((item, id) => ({ id, ...item }))
)

export const selector_hasEmptyLineItemTrackingInfo = createSelector(selector_pristineCartItems, cartItems => cartItems.some(cartItem => {
  //only applies to shippable parts
  const isShippable = !cartItem.materialInfo.nonShipabble
  return isShippable && (cartItem.lineItemTrackingInfo == null || cartItem.lineItemTrackingInfo.length == 0)
}))

export const selector_billing = state => get(selector_shoppingReq(state), 'billing', {})
export const selector_billingCompany = state => get(selector_billing(state), 'companyName', '')
export const selector_billingAttn = state => get(selector_billing(state), 'attentionLine', '')

export const selector_soldToNumber = state => get(selector_shoppingReq(state), ['soldTo', 'id'], null)
export const selector_salesAreaId = state => get(selector_shoppingReq(state), ['soldTo', 'salesAreaId'])
export const selector_ipsUser = state => selector_insight(state).ipsUser

export const selector_poNumber = state => get(selector_billing(state), ['payment', 'poNumber'], null)
export const selector_poReleaseNumber = state => get(selector_billing(state), ['payment', 'poReleaseNumber'], null)
export const selector_billingAddress = state => get(selector_billing(state), ['address'], {})

export const selector_attachedFile = state => get(selector_orderMetadata(state), ['file', 'path'], '')
export const selector_userContactEmail = state => get(selector_orderMetadata(state), ['userContact', 'email'], '')
export const selector_userContactName = state => get(selector_orderMetadata(state), ['userContact', 'name'], '')
export const selector_userContactPhone = state => get(selector_orderMetadata(state), ['userContact', 'phone'], '')
export const selector_smartTrackers = state => get(selector_orderMetadata(state), 'smartTracker', [])
export const selector_orderSmartTracker = createSelector(selector_smartTrackers, smartTrackers =>
  smartTrackers.filter(hasValue)
)
/**
 * -------------------------------
 *  Shipments Tab Selectors
 * -------------------------------
 */
export const selector_hasShippableItems = createSelector(selector_pristineCartItems, cartItems =>
  cartItems.some(item => item.materialInfo && !item.materialInfo.nonShipabble)
)

export const selector_formatedShipmentsTabData = createSelector(selector_pristineCartItems, cartItems =>
  cartItems.reduce((acc, item) => {
    const itemTrackingInfo = item.lineItemTrackingInfo || []
    const isShippable = !item.materialInfo.nonShipabble
    if (isShippable) {
      const {
        qtyShipped,
        quantity,
        shippingStatus,
        materialInfo: { description, imageURL, materialId },
      } = item
      const lineItemTrackingNumbers = itemTrackingInfo.length
        ? itemTrackingInfo.map(trackingNumber => {
            const {
              actualDeliveryDate,
              carrierName,
              estDeliveryDate,
              estShippingDate,
              shippingDate,
              shippingMethod,
            } = trackingNumber
            return {
              actualDeliveryDate,
              carrierName,
              estDeliveryDate,
              estShippingDate,
              shippingDate,
              shippingMethod,
              shippingStatus,
              materialInfo: {
                description,
                imageURL,
                materialId,
                qtyShipped,
                quantity,
              },
            }
          })
        : {
            shippingStatus,
            materialInfo: {
              description,
              imageURL,
              materialId,
              qtyShipped,
              quantity,
            },
          }

      return acc.concat(lineItemTrackingNumbers)
    }
    return acc
  }, [])
)

// Returns an Array of Shipments that are grouped by Shipping/Est Shipping Date and Shipping Method.
export const selector_shipments = createSelector(selector_formatedShipmentsTabData, formatedShipmentItems => {
  const itemsWithMilliseconds = formatedShipmentItems.map(item => ({
    ...item,
    millisecondsShippingDate: item.shippingDate || item.estShippingDate || null,
  }))
  const estShippingDateItemMap = groupBy(itemsWithMilliseconds, item => item.millisecondsShippingDate)
  const shippingDateGroups = Object.values(estShippingDateItemMap).map(products => {
    const shippingMethodItemMap = groupBy(products, product => product.shippingMethod)
    return Object.values(shippingMethodItemMap).map(shipmentItems => {
      // Creates Shipment header, thus we only need one item.
      const {
        actualDeliveryDate,
        carrierName,
        estDeliveryDate,
        estShippingDate,
        shippingDate,
        shippingMethod,
        shippingStatus,
      } = shipmentItems[0]
      return {
        actualDeliveryDate,
        carrierName,
        estDeliveryDate,
        estShippingDate,
        shipmentItems,
        shippingDate,
        shippingMethod,
        shippingStatus,
      }
    })
  })
  return shippingDateGroups.reduce((acc, shippingDate) => acc.concat(shippingDate), [])
})

/**
 * Returns the matching DEP item within cart items
 * it's a match if the item contains enrollment.enrolledDeviceId matching passed in sapLineItemNumber
 * @param  {string} sapLineItemNumber       sapLineItemNumber of the parent
 * @return {object}                         DEP item object
 */
export const selector_depInfo = (state, sapLineItemNumber) => {
  return selector_pristineCartItems(state).find(
    item => item.enrollment && item.enrollment.enrolledDeviceId === sapLineItemNumber
  )
}
//single selector to check all XD scenarios
export const selector_isXD = createSelector(
  selector_orderSummary,
  selector_hasEmptyLineItemTrackingInfo,
  selector_carrierOption,
  selector_shipments,
  ({ shippingCost }, hasEmptyLineItemTrackingInfo, carrierOption, shipments) => {
    //if shippingCost in order summary is greater than 0, XD scenario does not apply
    if(shippingCost > 0) {
      return false
    }
    //first XD conditon when a shippable part has empty lineItemTrackingInfo and shipping carrier option is XD
    if(hasEmptyLineItemTrackingInfo && carrierOption == 'XD') {
      return true
    }
    //second XD condition when one of the shipment has shippingMethod = XD
    const hasXDShippingMethod = shipments.some(shipment => {
      return shipment.shippingMethod == 'XD'
    })
    return hasXDShippingMethod
})
