import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import ReduxThunk from 'redux-thunk'

import initialState from './initialState'
import {
  SBBilling,
  SBManufacturer,
  SBMonth,
  SBProduct,
  SBRegion,
  SBShipping,
} from '../Dashboard/reducers/reportingReducers'
import UpcomingRenewals from '../Dashboard/reducers/renewalsReducers'
import {
  approverRequisitions,
  recentQuotes,
  recentOrders,
  recentInvoices,
  requestorRequisitions,
} from '../Dashboard/reducers'
import { licensePositionByPublisher, enterpriseAgreementDetails } from '../Dashboard/reducers/licenseReducers'
import { availableDashlets, dashboardSettings, countries } from '../Dashboard/reducers/settingsReducers'
import { dashletSettings, powerBI, Welcome } from '../Dashboard/reducers/dashletReducers'
import { userData } from '../Dashboard/reducers/userReducers'

const dashboard = combineReducers({
  countries,
  availableDashlets,
  dashboardSettings,
})
const reducers = combineReducers({
  approverRequisitions,
  dashboard,
  dashletSettings,
  enterpriseAgreementDetails,
  licensePositionByPublisher,
  powerBI,
  Welcome,
  recentQuotes,
  recentOrders,
  recentInvoices,
  requestorRequisitions,
  SBBilling,
  SBManufacturer,
  SBMonth,
  SBProduct,
  SBRegion,
  SBShipping,
  UpcomingRenewals,
  userData,
})

const composeEnhancers =
  process.env.NODE_ENV === 'production' ? compose : window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const store = createStore(reducers, initialState, composeEnhancers(applyMiddleware(ReduxThunk)))

export default store
