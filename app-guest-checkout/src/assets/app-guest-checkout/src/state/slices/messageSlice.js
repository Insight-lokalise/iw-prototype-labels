import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  messages: [],
};

const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push({
        id: uuidv4(),
        text: action.payload.text,
        type: action.payload.type,
      });
    },
    clearMessage: (state, action) => {
      state.messages = state.messages.filter(message => message.id !== action.payload);
    },
    clearAllMessages: (state, action) => {
      state.messages = []
    },
  },
});

export const { addMessage, clearMessage, clearAllMessages } = messageSlice.actions;

export const selector_Messages = state => state.persistReducer.messages.messages;

export default messageSlice.reducer;
