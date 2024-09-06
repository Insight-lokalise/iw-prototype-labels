import { createSlice } from '@reduxjs/toolkit'
import { getPersistCheckoutFromStorage, hasStorage } from "@insight/toolkit-utils/lib/helpers/storageHelpers";

const shoppingReqFromStorage = getPersistCheckoutFromStorage()
const shoppingReqFromStorageObject = shoppingReqFromStorage
const initialState =
  (hasStorage('persist:checkout') && shoppingReqFromStorageObject?.lineLevelSessionInfos) ?
  shoppingReqFromStorageObject?.lineLevelSessionInfos
  : []

const lineLevelSessionInfosSlice = createSlice({
  name: 'lineLevelSessionInfos',
  initialState,
  reducers: {
    save: (state, param) => {
      const { payload } = param
      const nextState = payload
      return nextState
    },
  },
})
const { actions, reducer } = lineLevelSessionInfosSlice
export const { save } = actions
export default reducer
