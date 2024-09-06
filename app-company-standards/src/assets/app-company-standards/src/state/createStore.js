import {
	applyMiddleware,
	compose,
	createStore
} from 'redux'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'
import immutableState from 'redux-immutable-state-invariant'
import createRootReducer from './createRootReducer'

const IS_DEV = process.env.NODE_ENV === 'development'

const composeEnhancers = (
  IS_DEV &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
) || compose

export default function configureStore(preloadedState) {
	const rootReducer = createRootReducer()
  const middleware = [
    IS_DEV && immutableState(),
    thunk,
    IS_DEV && createLogger({ collapsed: true })
  ].filter(Boolean)

  const rootEnhancers = composeEnhancers(applyMiddleware(...middleware))
	const store = createStore(
		rootReducer,
		preloadedState,
		rootEnhancers
	)
	return store
}
