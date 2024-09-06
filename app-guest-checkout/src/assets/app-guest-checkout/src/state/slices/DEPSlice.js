import { createSlice } from '@reduxjs/toolkit'

const DEP = createSlice({
  name: 'DEP',
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
const { actions, reducer } = DEP
export const { update } = actions
export default reducer