import {
  EXISTS_SBBILLING_DATA,
  EXISTS_SBMANUFACTURER_DATA,
  EXISTS_SBMONTH_DATA,
  EXISTS_SBPRODUCT_DATA,
  EXISTS_SBREGION_DATA,
  EXISTS_SBSHIPPING_DATA,
  GET_SBBILLING,
  GET_SBMANUFACTURER,
  GET_SBMONTH,
  GET_SBPRODUCT,
  GET_SBREGION,
  GET_SBSHIPPING,
  SAVE_SBBILLING,
  SAVE_SBMANUFACTURER,
  SAVE_SBMONTH,
  SAVE_SBPRODUCT,
  SAVE_SBREGION,
  SAVE_SBSHIPPING,
} from '../actionTypes'

const initialSBState = { initialLoad: false, hasData: false }

export function SBBilling(state = initialSBState, action) {
  switch (action.type) {
    case SAVE_SBBILLING:
      return { ...state, ...action.payload }
    case GET_SBBILLING:
      return { ...state, hasData: false }
    case EXISTS_SBBILLING_DATA:
      return { ...state, hasData: true }
    default:
      return state
  }
}
export function SBManufacturer(state = initialSBState, action) {
  switch (action.type) {
    case SAVE_SBMANUFACTURER:
      return { ...state, ...action.payload }
    case GET_SBMANUFACTURER:
      return { ...state, hasData: false }
    case EXISTS_SBMANUFACTURER_DATA:
      return { ...state, hasData: true }
    default:
      return state
  }
}
export function SBMonth(state = initialSBState, action) {
  switch (action.type) {
    case SAVE_SBMONTH:
      return { ...state, ...action.payload }
    case GET_SBMONTH:
      return { ...state, hasData: false }
    case EXISTS_SBMONTH_DATA:
      return { ...state, hasData: true }
    default:
      return state
  }
}
export function SBProduct(state = initialSBState, action) {
  switch (action.type) {
    case SAVE_SBPRODUCT:
      return { ...state, ...action.payload }
    case GET_SBPRODUCT:
      return { ...state, hasData: false }
    case EXISTS_SBPRODUCT_DATA:
      return { ...state, hasData: true }
    default:
      return state
  }
}
export function SBRegion(state = initialSBState, action) {
  switch (action.type) {
    case SAVE_SBREGION:
      return { ...state, ...action.payload }
    case GET_SBREGION:
      return { ...state, hasData: false }
    case EXISTS_SBREGION_DATA:
      return { ...state, hasData: true }
    default:
      return state
  }
}
export function SBShipping(state = initialSBState, action) {
  switch (action.type) {
    case SAVE_SBSHIPPING:
      return { ...state, ...action.payload }
    case GET_SBSHIPPING:
      return { ...state, hasData: false }
    case EXISTS_SBSHIPPING_DATA:
      return { ...state, hasData: true }
    default:
      return state
  }
}
