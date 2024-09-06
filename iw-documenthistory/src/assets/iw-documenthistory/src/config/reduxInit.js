import { store } from './storeConfig'
import { getUserData, loadInsightApplicationData } from '../Shared/actions'

const { dispatch } = store

export function reduxInit() {
  dispatch(getUserData(window.Insight))
  dispatch(loadInsightApplicationData())
}
