import { createSelector } from 'reselect'
import map from 'lodash-es/map'
import reduce from 'lodash-es/reduce'
import get from 'lodash-es/get'
import filter from 'lodash-es/filter'
import some from 'lodash-es/some'
import flatMap from 'lodash-es/flatMap'

import { selector_cartItemsByContract } from './cartView'
import { selector_locale } from '../../Insight/selectors'
import {
  selector_b2bLoginInfo,
  selector_isCES,
  selector_isEMEA,
  selector_isDefaultLoggedOutUserEnabled,
} from '../../User/selectors'

export const selector_cart = (state) => get(state, ['cart'], {})
export const selector_isCloudCart = (state) => selector_cart(state).cloudCart
export const selector_contracts = (state) =>
  get(selector_cart(state), ['contracts'], {})
export const selector_hasUsagePeriodReportableNonReportable = (state) =>
  selector_cart(state).hasUsagePeriodReportableNonReportable
export const selector_hasCoiOrCsi = (state) =>
  selector_cart(state).hasCOI || selector_cart(state).hasCSI
export const selector_contractWithId = (state, id = '') =>
  selector_cart(state).contracts[id]
export const selector_cartItems = (state, contractId = '') =>
  selector_contractWithId(state, contractId).cartItems
export const selector_cartItem = (state, materialIDKey, contractId = '') =>
  selector_cartItems(state, contractId)[materialIDKey] || {}
export const selector_webLoginProfile = (state) =>
  get(state, ['cart', 'webLoginProfile'], {}) || {}
export const selector_softwareVarientConfigFields = (state) =>
  get(state, ['cart', 'softwareVCInfoFields'], {}) || {}
export const selector_hasSoftwareContracts = (state) =>
  !!selector_webLoginProfile(state).softwareContracts
export const selector_isSavedQuote = (state) =>
  !!get(selector_cart(state), ['quoteOrderRequest', 'quoteNumber'], false)
export const selector_isOrderTemplate = (state) =>
  !!get(selector_cart(state), 'orderTemplate', false)
export const selector_hasSavedRequestorGroup = (state) =>
  !!selector_cart(state).requestorGroup &&
  !!selector_cart(state).requestorGroupId
export const selector_transportsToDetermine = (state) =>
  selector_cart(state).transportsToDetermine

export const selector_hasOutOfStockItems = (state) =>
  hasOutOfStockCartItems(selector_cart(state))

const hasOutOfStockCartItems = (cart) =>
  cart.contracts &&
  Object.values(cart.contracts).some(
    (contract) =>
      contract.cartItems &&
      Object.values(contract.cartItems).some(
        (cartItem) =>
          cartItem.unlimited == false &&
          cartItem.stock === 0 &&
          !cartItem.quoteItemNumber
      )
  )

export const selector_hasQtyExceedsStockCartItems = (state) =>
  hasQtyExceedsStockCartItems(selector_cart(state))

const hasQtyExceedsStockCartItems = (cart) =>
  cart.contracts &&
  Object.values(cart.contracts).some(
    (contract) =>
      contract.cartItems &&
      Object.values(contract.cartItems).some(
        (cartItem) =>
          cartItem.unlimited == false &&
          cartItem.quantity > cartItem.stock &&
          !cartItem.quoteItemNumber
      )
  )

export const selector_savedRequestorGroup = (state) => {
  const cart = selector_cart(state)
  return {
    requestorGroupName: cart.requestorGroup,
    requestorGroupId: cart.requestorGroupId,
  }
}

export const selector_selectInvalidCESParts = (state) => {
  // returns an array of invalid parts (materialID strings)
  const cart = selector_cart(state)

  if (
    !selector_isCES(state) ||
    !cart.invalidCESMaterialIDs ||
    !cart.invalidCESMaterialIDs.length
  )
    return []

  return cart.invalidCESMaterialIDs
}

/**
 * Get the materialIds from every item in the cart
 * Good example of a selector that should be memoized by reselect
 *
 * TODO: Should Bundles' items be included in this list?
 *
 * @param  {Object} state   Whole state
 * @return {Array}          Array of materialId strings of items in the cart
 */

export const selectCartItemMaterialIds = createSelector(
  selector_cart,
  ({ contracts }) =>
    reduce(
      contracts,
      (cartItems, contract) => {
        const items = reduce(
          contract.cartItems,
          (cartItemsInContract, item) => {
            if (item.bundle) {
              const lineItems = map(
                item.lineItems,
                (lineItem) => lineItem.materialID
              )
              cartItemsInContract = cartItemsInContract.concat(lineItems)
            } else {
              cartItemsInContract = cartItemsInContract.concat([
                item.materialID,
              ])
            }
            return cartItemsInContract
          },
          []
        )
        return cartItems.concat(items)
      },
      []
    )
)

/**
 * Get the materialIds from every item in the cart for a given contract
 * @param  {object} state      [description]
 * @param  {String} contractId [description]
 * @return {Array}            [description]
 */
export const selectCartItemMaterialIdsByContract = (state, contractId) =>
  // Maybe I dont want items in bundle as they are not cart items
  // this is used in accessories modal to determine if we have it in cart or not
  map(selector_cartItems(state, contractId), (item) => item.materialID) || []

/**
 * Get the warranty materialIds from provided cart item in the cart for a given contract
 * @param  {object} state      [description]
 * @param  {String} contractId [description]
 * @return {Array}            [description]
 */
export const selectCartItemWarrentiesByContract = (
  state,
  contractId,
  materialIDKey
) => {
  // need to look at bundle scenario, how fetch line items if a valid scenario
  const cartItem = selector_cartItem(state, materialIDKey, contractId)
  const OEMWarrantyItems =
    cartItem && map(cartItem.productWarranties, (item) => item.warrMaterialId)
  const IPPWarrantyItems =
    cartItem && map(cartItem.warrantyDetails, (item) => item.warrMaterialId)
  return OEMWarrantyItems.concat(IPPWarrantyItems) || []
}

/**
 * Finds those cartItems which have had their quantities changed, returning an Array
 * of their appropriate { contractID, materialID, and quantity }
 *
 * NOTE: contractID and materialID are really IDKeys, or their respective key in the cart.
 * NOTE: Good candidate for memoizing.
 *
 * @param  {Object} state           whole state
 * @return {Array<Object>}          An array of { contractID, materialID, and quantity }
 */
const reduceCartItemsByContractIntoTentativeQuantities = (
  cartItemsByContract,
  isCES,
  isLoggedOutDefaultUser
) =>
  reduce(
    cartItemsByContract,
    (acc, cartItem, contractMaterialIDKey) => {
      const contract__materialIDKey = contractMaterialIDKey.split('__')
      const cartItemQuantities = Object.assign(
        {},
        {
          contractID: contract__materialIDKey[0],
          materialID: contract__materialIDKey[1],
          quantity: quantity(isCES, isLoggedOutDefaultUser, cartItem),
        }
      )
      return 'tentativeQuantity' in cartItem
        ? acc.concat(cartItemQuantities)
        : acc
    },
    []
  )

const quantity = (isCES, isLoggedOutDefaultUser, cartItem) => {
  if (!cartItem.nonShippable && (isCES || isLoggedOutDefaultUser)) {
    return cartItem.tentativeQuantity > cartItem.stock
      ? cartItem.stock
      : cartItem.tentativeQuantity
  }
  return cartItem.tentativeQuantity
}

export const selector_cartItemTentativeQuantities = createSelector(
  selector_cartItemsByContract,
  selector_isCES,
  selector_isDefaultLoggedOutUserEnabled,
  reduceCartItemsByContractIntoTentativeQuantities
)

export const shippableItemsInCart = (state) =>
  reduce(
    selector_cart(state).contracts,
    (shippableCartItems, contract) => {
      const items = reduce(
        contract.cartItems,
        (cartItems, item) => {
          if (item.bundle) {
            const lineItems = filter(
              item.lineItems,
              (lineItem) => !lineItem.nonShipabble
            )
            cartItems = cartItems.concat(lineItems)
          } else if (!item.nonShipabble) {
            cartItems = cartItems.concat([item])
          }
          return cartItems
        },
        []
      )
      return shippableCartItems.concat(items)
    },
    []
  )

export const cartHasShippableItems = (state) =>
  shippableItemsInCart(state).length > 0

/**
 * returns cart based on usertype
 * @param  {object} state [description]
 * @return {object}   cart    [description]
 */
export const selectTransformedCartByUserType = (state) => {
  // if B2B user need to remove Tax info
  let cart = selector_cart(state)
  const isB2BUser = selector_b2bLoginInfo(state).isB2BUser || false
  const locale = selector_locale(state)
  const isEMEA = selector_isEMEA(state)
  if (isB2BUser && locale !== 'en_US' && !isEMEA) {
    cart = {
      ...cart,
      totalCost: Number(cart.totalCost - cart.taxCost),
      taxCost: 0,
    }
  }
  return cart
}

export const selectDirectBillableItems = (state) => {
  const softwareContracts = get(
    selector_webLoginProfile(state),
    'softwareContracts'
  )
  if (!softwareContracts) return []
  return reduce(
    selector_cart(state).contracts,
    (directBillableContractItems, contract) => {
      const items = reduce(
        contract.cartItems,
        (directBillablecartItems, item) => {
          if (item.bundle) {
            const lineItems = filter(
              item.lineItems,
              itemIsDirectBillable.bind(null, softwareContracts)
            )
            return directBillablecartItems.concat(lineItems)
          } else if (itemIsDirectBillable(softwareContracts, item)) {
            return directBillablecartItems.concat([item])
          }
          return directBillablecartItems
        },
        []
      )
      return directBillableContractItems.concat(items)
    },
    []
  )
}

function itemIsDirectBillable(softwareContracts, item) {
  return some(
    softwareContracts,
    (swContract) =>
      swContract.directBill && swContract.contractID === item.softwareContractId
  )
}

/**
 * determins if user is a shared user
 * @param  {object} state redux state
 * @return {bool}
 */
export function selector_isSharedUser(state) {
  const webLoginProfile = selector_webLoginProfile(state)
  return get(webLoginProfile, ['webLoginTypeId'], false) === 1
}

/**
 * counts the number of different line items -- bundles count as 1
 * @param  {object} contracts contracts object from cart response
 * @return {number}           count of items to be displayed at top of cart
 */
export function selector_numberOfItemsInCart(state) {
  const { contracts } = selector_cart(state)
  let numberOfItemsInCart = 0
  Object.keys(contracts).forEach((contractName) => {
    Object.keys(contracts[contractName].cartItems).forEach(() => {
      numberOfItemsInCart++
    })
  })
  return numberOfItemsInCart
}

export function selector_isCartPending(state) {
  const cart = selector_cart(state)
  return get(cart, ['isPending'], false)
}
/**
 * Select cartItem for Google Analytics Ecommerce
 * @param state
 * @param materialIDKey
 */
export const selector_cartItemGAE = (
  state,
  materialID,
  contract,
  materialIDKey
) => {
  if (contract !== undefined && materialIDKey) {
    const item = selector_contracts(state)[contract].cartItems[materialIDKey]
    return {
      name: item.description,
      id: item.materialID,
      productSku: item.mfrPartNumber,
      insightPartId: item.materialID,
      price: item.price,
      brand: item.manufacturerName,
      category: item.categoryId,
      quantity: item.quantity,
      currency: item.currency,
    }
  }
  const item = selector_cartItemsGAE(state, contract).find(
    (item) => item.productSku === materialID
  )
  return item
}

export const selector_cartItemsGAE = (state, contractID) => {
  let contracts = selector_contracts(state)
  if (contractID) {
    contracts = contracts.filter((c) => c.contractID === contractID)
  }
  const items = flatMap(contracts, (contract) => {
    const { cartItems } = contract
    return Object.keys(cartItems).map((key) => cartItems[key])
  })
  return items.map((item) => ({
    name: item.description,
    insightPartId: item.materialID,
    productSku: item.mfrPartNumber,
    price: item.price,
    brand: item.manufacturerName,
    category: item.categoryId,
    quantity: item.quantity,
    currency: item.currency,
  }))
}

export const selector_hasLineLevelsInfoPopulated = (state) => {
  const { contracts } = selector_cart(state)
  let hasLinelevelinfoPopulated = false
  Object.keys(contracts).forEach((contractKey) => {
    const contract = contracts[contractKey]
    if (hasLinelevelinfoPopulated) return
    const {
      cartItems,
      doesPartnerDiversityExistForContract,
      partners = [],
    } = contract
    Object.keys(cartItems).forEach((itemKey) => {
      const item = cartItems[itemKey]
      if (hasLinelevelinfoPopulated) return
      const {
        contractReportingFields,
        sellRequirement,
        showCountryOfUsage,
        lineLevels,
        partnerID,
        bundle,
      } = item
      const sharedProps = {
        doesPartnerDiversityExistForContract,
        licenseInfo: sellRequirement,
        showCountryOfUsage,
        smartTracker: lineLevels,
        savedContractReportingFields: contractReportingFields,
        partnerID,
        partners,
      }
      if (item.bundle) {
        hasLinelevelinfoPopulated = hasCartItemHasLineLevels({
          bundledItem: false,
          bundleHeader: true,
          ...sharedProps,
        })
        Object.keys(item.lineItems).forEach((lineItemKey) => {
          if (hasLinelevelinfoPopulated) return
          const lineItem = item.lineItems[lineItemKey]
          const {
            contractReportingFields,
            sellRequirement,
            showCountryOfUsage,
            lineLevels,
            partnerID,
            bundle,
          } = lineItem
          hasLinelevelinfoPopulated = hasCartItemHasLineLevels({
            bundledItem: bundle,
            bundleHeader: false,
            doesPartnerDiversityExistForContract,
            licenseInfo: sellRequirement,
            showCountryOfUsage,
            smartTracker: lineLevels,
            savedContractReportingFields: contractReportingFields,
            partnerID,
            partners,
          })
        })
      } else {
        hasLinelevelinfoPopulated = hasCartItemHasLineLevels({
          bundledItem: bundle,
          bundleHeader: false,
          ...sharedProps,
        })
      }
    })
  })
  return hasLinelevelinfoPopulated
}

export const hasCartItemHasLineLevels = (item) => {
  const {
    bundledItem,
    bundleHeader,
    doesPartnerDiversityExistForContract,
    licenseInfo,
    showCountryOfUsage,
    savedContractReportingFields,
    smartTracker,
    partnerID,
    partners,
  } = item

  const showLineLevelLinkDueToLicenseInfo =
    (!bundleHeader &&
      licenseInfo &&
      !licenseInfo.suppressSellReq &&
      filterLicenseInfoValues(licenseInfo).length > 0) ||
    showCountryOfUsage

  const showLineLevelLinkDueToContractSpecificInfo =
    !bundledItem &&
    ((savedContractReportingFields &&
      filterContractInfo(savedContractReportingFields).length > 0) ||
      (!!partnerID &&
        doesPartnerDiversityExistForContract &&
        partners.length > 0))

  const showLineLevelLinkDueToSmartTrackers =
    (bundleHeader || !bundledItem) && Object.keys(smartTracker).length > 0

  return (
    showLineLevelLinkDueToLicenseInfo ||
    showLineLevelLinkDueToContractSpecificInfo ||
    showLineLevelLinkDueToSmartTrackers
  )
}

export function filterLicenseInfoValues(licenseInfo) {
  if (licenseInfo && licenseInfo.characteristics) {
    return licenseInfo.characteristics.filter((info) => !!info.value)
  }
  return []
}

export function filterContractInfo(savedContractReportingFields) {
  // if .savedContractReportingFields is populated then iterate through and show all smart trackers with value and sapmapping > 3
  const contractInfoToBeRendered = []
  Object.keys(savedContractReportingFields).forEach((name) => {
    if (
      savedContractReportingFields[name].value &&
      savedContractReportingFields[name].sapmapping > 3
    ) {
      contractInfoToBeRendered.push(savedContractReportingFields[name])
    }
  })
  return contractInfoToBeRendered
}

export function filterSmartTrackersWithValues(smartTrackerObject) {
  return Object.keys(smartTrackerObject)
    .filter((smartTrackerKey) => smartTrackerObject[smartTrackerKey].value)
    .map((smartTrackerKey) => smartTrackerObject[smartTrackerKey])
    .reduce((acc, curr) => {
      acc[curr.lineLevelId] = curr
      return acc
    }, {})
}

export function validateAndCheckIfHasRequired(objToIterate) {
  return (
    objToIterate &&
    Object.keys(objToIterate).filter((key) => objToIterate[key].required)
      .length > 0
  )
}
