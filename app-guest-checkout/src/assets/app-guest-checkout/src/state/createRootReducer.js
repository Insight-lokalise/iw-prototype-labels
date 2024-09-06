import { combineReducers } from '@reduxjs/toolkit'
import { persistReducer, createTransform } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import shoppingRequestReducer from './slices/shoppingRequestSlice'
import lineLevelSessionInfosReducer from './slices/lineLevelSessionInfosSlice'
import tentativeQuantityReducer from './slices/tentativeQuantitySlice'
import materialListReducer from './slices/materialListSlice'
import flagsReducer from './slices/flagsSlice'
import customerInfoReducer from './slices/userInformationSlice'
import DEPReducer from './slices/DEPSlice'
import invalidIdsReducer from './slices/invalidIdsSlice'
import userDataReducer from './slices/userDataSlice'
import messageReducer from './slices/messageSlice'
import receiptReducer from './slices/receiptSlice'
import receiptHeaderReducer from './slices/receiptHeaderSlice'
import CryptoJS from 'crypto-js';

const encrypt = createTransform(
  (inboundState, key) => {
    if (!inboundState) return inboundState;
    const cryptedText = CryptoJS.AES.encrypt(JSON.stringify(inboundState), 'pgEYVPzG14pZiB7BjdU65VtbuTDViar4');

    return cryptedText.toString();
  },
  (outboundState, key) => {
    if (!outboundState) return outboundState;
    const bytes = CryptoJS.AES.decrypt(outboundState, 'pgEYVPzG14pZiB7BjdU65VtbuTDViar4');
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    return JSON.parse(decrypted);
  },
);

const persistConfig = {
  key: 'checkout',
  storage, //
  transforms: [encrypt]// local storage is used
}

const persistReducerPart = persistReducer(
  persistConfig,
  combineReducers({
    shoppingRequest: shoppingRequestReducer,
    lineLevelSessionInfos: lineLevelSessionInfosReducer,
    materialList: materialListReducer,
    flags: flagsReducer,
    customerInformation: customerInfoReducer,
    invalidIds: invalidIdsReducer,
    messages: messageReducer,
    receiptHeader: receiptHeaderReducer,
  })
)

export default function createRootReducer() {
  return {
    persistReducer: persistReducerPart,
    tentativeQuantity: tentativeQuantityReducer,
    DEP: DEPReducer,
    userData: userDataReducer,
    receipt: receiptReducer,
  }
}
