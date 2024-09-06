import { createSlice } from '@reduxjs/toolkit'
import initialState from '../initialState'

const customerInfoSlice = createSlice({
  name: 'customerInformation',
  initialState: initialState?.customerInformation,
  reducers: {
    createCustomer: (state, param) => {
      const { payload } = param
      const nextState = { ...state, ...payload }
      return nextState
    },
  },
})

const { actions, reducer } = customerInfoSlice
export const { createCustomer } = actions
export default reducer
