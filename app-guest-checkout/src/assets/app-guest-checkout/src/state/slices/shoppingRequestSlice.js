import { createSlice } from '@reduxjs/toolkit'
import { getPersistCheckoutFromStorage, hasStorage } from "@insight/toolkit-utils/lib/helpers/storageHelpers";
import initialGlobalState from '../initialState'

const shoppingReqFromStorage = getPersistCheckoutFromStorage()
const shoppingReqFromStorageObject = shoppingReqFromStorage
const initialState =
  (hasStorage('persist:checkout') && shoppingReqFromStorageObject?.shoppingRequest) ?
  shoppingReqFromStorageObject?.shoppingRequest
  : null

const shoppingRequestSlice = createSlice({
  name: 'shoppingRequest',
  initialState,
  reducers: {
    save: (state, param) => {
      const { payload } = param
      const nextState = {...payload }
      return nextState
    },
    clear: () => {
      const nextState = {...initialGlobalState.initialShoppingRequest }
      return nextState
      // return null
    },
  },
})
const { actions, reducer } = shoppingRequestSlice
export const { save, clear } = actions
export default reducer
