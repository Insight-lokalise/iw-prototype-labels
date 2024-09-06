import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  shoppingRequest: null,
  lineLevelSessionInfos: [],
  orderDate: "",
  webReferenceNumber: 0,
};

const receiptSlice = createSlice({
  name: 'receipt',
  initialState,
  reducers: {
    setReceipt: (state, action) => {
      const nextState = {...action.payload}
      return nextState
    }
  },
});
const { actions, reducer } = receiptSlice
export const { setReceipt } = actions
export default reducer
