import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import ReduxThunk from 'redux-thunk'
import { reducer as formReducer } from 'redux-form'

import { insightApplicationData } from '../Shared/reducers/insightApplicationDataReducer'
import { userData } from '../Shared/reducers/userReducers'
import insight from '../Shared/reducers/InsightReducer'
import initialState from './initialState'
import orderSearch from '../Orders/Search/reducers/simpleSearchReducer'
import orderDetail from '../Orders/Details/reducers/orderDetailReducer'

const reducers = combineReducers({
  /* your reducers here */
  user: userData,
  insight,
  insightApplicationData,
  orderSearch,
  orderDetail,
  form: formReducer,
})

const composeEnhancers =
  process.env.NODE_ENV === 'production' ? compose : window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const store = createStore(reducers, initialState, composeEnhancers(applyMiddleware(ReduxThunk)))

export default store
