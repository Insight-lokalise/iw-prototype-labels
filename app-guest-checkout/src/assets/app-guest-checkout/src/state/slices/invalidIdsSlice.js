import { createSlice } from '@reduxjs/toolkit'
import {
  hasStorage,
  getPersistCheckoutFromStorage
} from '@insight/toolkit-utils/lib/helpers/storageHelpers'

const shoppingReqFromStorage = getPersistCheckoutFromStorage()
const shoppingReqFromStorageObject = shoppingReqFromStorage
const initialState =
  hasStorage('persist:checkout') && shoppingReqFromStorageObject?.invalidIds
    ? shoppingReqFromStorageObject?.invalidIds
    : null
let firstcleared = true

const invalidIdsSlice = createSlice({
  name: 'invalidIds',
  initialState,
  reducers: {
    save: (state, param) => {
      const { payload } = param
      const nextState = payload
      return [...nextState]
    },
    clear: () => {
      const nextState = firstcleared? initialState: null
      firstcleared = false
      return nextState
    },
  },
})
const { actions, reducer } = invalidIdsSlice
export const { save, clear } = actions
export default reducer
