import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  poNumber: null,
  poReleaseNumber: null,
  totalCost: 0,
  orderDate: '',
  webReferenceNumber: 0,
  locale: '',
  currencyCode: '',
}

const receiptHeaderSlice = createSlice({
  name: 'receiptHeader',
  initialState,
  reducers: {
    setReceiptHeader: (state, action) => {
      const nextState = { ...action.payload }
      return nextState
    },
    clearReceiptHeader: (state, action) => {
      return initialState
    },
  },
})

const { actions, reducer } = receiptHeaderSlice
export const { setReceiptHeader, clearReceiptHeader } = actions
export default reducer
