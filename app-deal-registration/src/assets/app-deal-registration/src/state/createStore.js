import { applyMiddleware, compose, createStore } from 'redux'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'
import immutableState from 'redux-immutable-state-invariant'

import { IS_DEV } from 'lib'
import { errorMiddleware } from './middleware'
import createRootReducer from './createRootReducer'

const composeEnhancers = (
	IS_DEV &&
	window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
) || compose

export default function configureStore(preloaded) {
	const rootReducer = createRootReducer()
	const middleware = [
		IS_DEV && immutableState(),
		thunk,
		errorMiddleware,
		IS_DEV && createLogger({ collapsed: true })
	].filter(Boolean)

	const rootEnhancers = composeEnhancers(applyMiddleware(...middleware))
	const store = createStore(rootReducer, preloaded, rootEnhancers)
	return store
}
