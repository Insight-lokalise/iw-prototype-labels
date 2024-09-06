import * as actions from '../actions'


// Mock initial state, for testing purposes only.
const INITIAL_STATE = {
  title: '',
  insightNumber: '',
} 


// The reducer function takes the existing state (defaulting to the initial
// state) and an action to apply.
export default (state = INITIAL_STATE, action) => {
  switch(action.type) {


    // Upon receiving a new product object, replace the entire state with a
    // copy of it.
    case actions.RECEIVE_PRODUCT:
      return { ...action.product }


    // For all other actions, do not modify the state.
    default:
      return state

  }
}
