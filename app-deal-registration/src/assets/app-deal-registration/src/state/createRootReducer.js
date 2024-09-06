import { combineReducers } from 'redux'

import { builderReducer } from './builder'
import { displayReducer } from './display'

export default function createRootReducer() {
	return combineReducers({
		builder: builderReducer,
		display: displayReducer
	})
}
