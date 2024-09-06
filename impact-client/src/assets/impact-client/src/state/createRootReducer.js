import { combineReducers } from 'redux'

const emptyReducer = (state, action) => state

export default function createRootReducer() {
	return combineReducers({
		empty: emptyReducer
	})
}
