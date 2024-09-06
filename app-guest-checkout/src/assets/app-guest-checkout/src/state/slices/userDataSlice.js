import { createSlice } from '@reduxjs/toolkit';
import initialState from '../initialState'

const userDataSlice = createSlice({
  name: 'userData',
  initialState: initialState.userData,
  reducers: {
    setUserData: (state, action) => {
      const { payload } = action;
      return { ...state, ...payload };
    },
    clearUserData: (state) => {
      return { ...initialState };
    },
  },
});

export const { setUserData, clearUserData } = userDataSlice.actions;

export default userDataSlice.reducer;

