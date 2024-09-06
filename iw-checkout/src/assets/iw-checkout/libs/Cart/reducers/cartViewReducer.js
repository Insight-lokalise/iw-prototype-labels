import { combineReducers } from 'redux'
import omit from 'lodash-es/omit'
import reduce from 'lodash-es/reduce'

import * as constants from '../constants'
import InitialState from '../../../app/libs/initialState'
import {
  selector_cartItemsByContract,
  selector_cartItemsEnrollment,
} from '../selectors'
import { makeUniqueCartItemId } from '../../models/Cart'
import map from 'lodash-es/map'
import {
  selector_isCES,
  selector_isDefaultLoggedOutUserEnabled,
} from '../../User/selectors'

export default combineReducers({
  cartViewByContractsAndMaterialIDKey,
})

function cartViewByContractsAndMaterialIDKey(
  state = selector_cartItemsByContract(InitialState),
  action
) {
  let currentState
  let nextState
  const uniqueCartItemID =
    action.payload && makeUniqueCartItemId(action.payload)
  switch (action.type) {
    default:
      return state
    case constants.CLEAR_NORMALIZED_CART:
      return selector_cartItemsByContract(InitialState)
    case constants.CLEAR_ITEM_FROM_NORMALIZED_CART:
      nextState = state[uniqueCartItemID]
        ? delete state[uniqueCartItemID]
        : state
      return {
        ...state,
        ...nextState,
      }
    case constants.RECEIVE_CART_RESPONSE: {
      const currentKeys = Object.keys(state)
      const keysInCart = reduce(
        action.payload.contracts,
        (cartItems, contract, contractId) => {
          const items = reduce(
            contract.cartItems,
            (cartItemsInContract, item) => {
              if (item.bundle) {
                const lineItems = map(
                  item.lineItems,
                  (lineItem) => `${contractId}__${lineItem.materialIDKey}`
                )
                cartItemsInContract = cartItemsInContract.concat(lineItems)
              } else {
                cartItemsInContract = cartItemsInContract.concat([
                  `${contractId}__${item.materialIDKey}`,
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
      const nonStaleKeys = currentKeys.filter((key) => keysInCart.includes(key))
      const nextState = nonStaleKeys.reduce((acc, item) => {
        acc[item] = { ...state[item] }
        return acc
      }, {})
      // FOR CES, excluding bundles , need to find an easier way to identify use is CES, below is deviation from
      // redux action definition
      const isCES = selector_isCES(action.globalState)
      const isLoggedOutDefaultUser = selector_isDefaultLoggedOutUserEnabled(
        action.globalState
      )
      if (isCES || isLoggedOutDefaultUser) {
        const finalState = keysInCart.reduce((acc, item) => {
          const [contract, matIDKey] = item.split('__')
          const { nonShipabble = false, quantity } =
            action.payload.contracts[contract].cartItems[matIDKey] || {}
          if (nextState[item]) {
            acc[item] = { ...nextState[item] }
          }
          if (!nonShipabble) {
            acc[item] = nextState[item]
              ? { ...nextState[item], tentativeQuantity: quantity }
              : { tentativeQuantity: quantity }
          }
          return acc
        }, {})
        return { ...finalState }
      }

      return { ...nextState }
    }
    case constants.UPDATE_TENTATIVE_CART_ITEM_QUANTITY:
      currentState = state[uniqueCartItemID] || {}
      nextState = Object.assign(
        {},
        {
          [uniqueCartItemID]: {
            ...currentState,
            nonShippable: action.payload.nonShippable,
            stock: action.payload.stock,
            tentativeQuantity: action.payload.quantity,
          },
        }
      )
      return {
        ...state,
        ...nextState,
      }
    // case constants.CLEAR_TENTATIVE_CART_ITEM_QUANTITY:
    //   return {}
    case `${constants.UPDATE_CART_ITEM_QUANTITIES}_FULFILLED`:
      return reduce(
        state,
        (acc, uniqueCartItem, uniqueCartItemID) => {
          if ('tentativeQuantity' in uniqueCartItem) {
            acc[uniqueCartItemID] = omit(uniqueCartItem, 'tentativeQuantity')
          }
          return acc
        },
        state
      )
    case `${constants.GET_ACCESSORIES}_FULFILLED`:
      currentState = state[uniqueCartItemID] || {}
      nextState = Object.assign(
        {},
        {
          [uniqueCartItemID]: {
            ...currentState,
            product: action.payload.product,
          },
        }
      )
      return {
        ...state,
        ...nextState,
      }
    case `${constants.GET_CES_ACCESSORIES}_FULFILLED`:
      currentState = state[uniqueCartItemID] || {}
      nextState = Object.assign(
        {},
        {
          [uniqueCartItemID]: {
            ...currentState,
            product: action.payload.product,
          },
        }
      )
      return {
        ...state,
        ...nextState,
      }
    case `${constants.GET_WARRANTIES}_FULFILLED`:
      currentState = state[uniqueCartItemID] || {}
      nextState = Object.assign(
        {},
        {
          [uniqueCartItemID]: {
            ...currentState,
            productWarrantyData: action.payload.warrantyData,
          },
        }
      )
      return {
        ...state,
        ...nextState,
      }
    case `${constants.GET_THIRD_PARTY_WARRANTIES}_FULFILLED`:
      return {
        ...state,
        [uniqueCartItemID]: {
          ...state[uniqueCartItemID],
          thirdPartyWarranties: action.payload.thirdPartyWarranties,
        },
      }
    case constants.UPDATE_TENTATIVE_CART_ITEM_DEP_INFO:
      currentState = state[uniqueCartItemID] || {}
      const {
        materialIDKey: parentId,
        contractID: contractId,
        ...rest
      } = action.payload
      nextState = Object.assign(
        {},
        {
          [uniqueCartItemID]: {
            ...currentState,
            parentId,
            contractId,
            ...rest,
          },
        }
      )
      selector_cartItemsEnrollment(state)
      return {
        ...state,
        ...nextState,
      }

    case constants.DEP_INFO_COPY_TO_ALL_IN_CONTRACT: {
      const {
        customerId,
        DEPChecked,
        isExistingID,
        invalidID,
        isNewEnrollment,
        selectedCustomerID,
        enteredCustomerID,
      } = state[uniqueCartItemID] || {}

      const { materialIDKey } = action.payload

      nextState = Object.keys(state).reduce((acc, key) => {
        const [contract, idKey] = key.split('__')
        const currentItem = state[key]
        if (idKey != materialIDKey) {
          const copedItem = {
            ...currentItem,
            customerId,
            DEPChecked,
            isExistingID,
            invalidID,
            isNewEnrollment,
            selectedCustomerID,
            enteredCustomerID,
          }
          acc[key] = copedItem
        }
        return acc
      }, {})
      return {
        ...state,
        ...nextState,
      }
    }

    case constants.ADD_ENROLLED_CHILD_ITEMS:
      currentState = state[uniqueCartItemID] || {}
      nextState = Object.assign(
        {},
        {
          [`lineLevelForm__${action.payload.contractId}__${action.payload.bundleParentMaterialIDKey}__${action.payload.materialIDKey}`]:
            {
              bundle: action.payload.bundle,
              childEnrollmentId: action.payload.childEnrollmentId,
              contractId: action.payload.contractId,
              materialIDKey: action.payload.materialIDKey,
              parentMaterialId: action.payload.parentMaterialId,
            },
        }
      )
      return {
        ...state,
        ...nextState,
      }
  }
}
