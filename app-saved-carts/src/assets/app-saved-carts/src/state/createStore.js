import { applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'

import createRootReducer from './createRootReducer'

const IS_DEV = process.env.NODE_ENV === 'development'

const composeEnhancers = (
	IS_DEV &&
	window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
) || compose

const emptyMiddleware = store => next => action => next(action)

export default function configureStore(preloadedState) {
	const rootReducer = createRootReducer()
	const rootEnhancers = composeEnhancers(
		applyMiddleware(
			IS_DEV ? require('redux-immutable-state-invariant').default() : emptyMiddleware,
			thunk,
			IS_DEV ? require('redux-logger').createLogger({ collapsed: true }) : emptyMiddleware
		)
	)

	const store = createStore(
		rootReducer,
		preloadedState,
		rootEnhancers
	)

	return store
}
