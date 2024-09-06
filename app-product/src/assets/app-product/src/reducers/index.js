import { combineReducers } from 'redux'
import product from './product'


// Combine all of our reducers into a single root reducers, where each nested
// reducer works on part of the overall application state.
const appReducer = combineReducers({
  product,
})


// Return a reducer function that simply calls our combined reducers.
export default (state, action) => appReducer({ ...state }, action)
