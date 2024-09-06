import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import reducers from './reducers'


// Setup required middleware: support for Redux devtools and thunk support.
// eslint-disable-next-line no-underscore-dangle
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const middlewares = [thunk]


// Create and export a new Redux store, using our reducers, empty state, and
// the required middleware and devtool support.
export default createStore(
  reducers,
  {},
  composeEnhancers(
    applyMiddleware(...middlewares),
  ),
)