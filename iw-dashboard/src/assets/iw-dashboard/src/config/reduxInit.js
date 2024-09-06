import { store } from './storeConfig'

import { getUserData } from '../Dashboard/actions/userActions'
import { getDashboard } from '../Dashboard/actions/settingsActions'

const { dispatch } = store

export default function reduxInit() {
  dispatch(getUserData(window.Insight))
  dispatch(getDashboard())
}
