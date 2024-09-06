import { createSlice } from '@reduxjs/toolkit'
import initialState from '../initialState'

const materialListSlice = createSlice({
  name: ' materialList',
  initialState: initialState.materialList,
  reducers: {
    update: (state, param) => {
      const { payload } = param
      const nextState = { ...state, ...payload }
      return nextState
    },
  },
})
const { actions, reducer } =  materialListSlice
export const { update } = actions
export default reducer
