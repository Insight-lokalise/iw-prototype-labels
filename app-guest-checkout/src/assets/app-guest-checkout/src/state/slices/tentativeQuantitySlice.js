import { createSlice } from '@reduxjs/toolkit'

const tentativeQuantity = createSlice({
  name: 'item',
  initialState: {},
  reducers: {
    update: (state, param) => {
      const { payload } = param
      const nextState = { ...state, ...payload }
      return nextState
      //return state
    },
  },
})
const { actions, reducer } = tentativeQuantity
export const { update } = actions
export default reducer