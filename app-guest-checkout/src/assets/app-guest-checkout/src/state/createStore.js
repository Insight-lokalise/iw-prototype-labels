import { configureStore, createImmutableStateInvariantMiddleware } from '@reduxjs/toolkit'
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import createRootReducer from './createRootReducer'

const IS_DEV = process.env.NODE_ENV === 'development'
const immutableInvariantMiddleware = createImmutableStateInvariantMiddleware()
const middleware = IS_DEV ? [thunk, logger, immutableInvariantMiddleware ]: [thunk]

export default function createStore(preloadedState) {
	const rootReducer = createRootReducer()
	const store = configureStore({
      reducer: rootReducer,
      devTools: IS_DEV,
      middleware,
      preloadedState
  })

	return store
}
