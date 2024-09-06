import { createSlice } from '@reduxjs/toolkit'
import initialState from '../../state/initialState'

const flagsSlice = createSlice({
  name: 'flags',
  initialState: { ...initialState?.flags, ...window?.flags },
  reducers: {},
})
const { reducer } = flagsSlice
export default reducer
