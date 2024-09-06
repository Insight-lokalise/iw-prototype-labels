import {
  ADD_DASHLET,
  CHANGE_LAYOUT,
  CREATE_TAB,
  GET_DASHBOARD,
  REMOVE_DASHLET,
  SAVE_DASHBOARD,
  SAVE_TAB,
} from '../actionTypes'
import { TAB_FAVORITES } from '../components/constants'
import { selector_dashboardSettings, selector_tabIsMissing } from '../selectors/settingsSelectors'
import initialState from '../../config/initialState'
import { fetchDashboard } from "../../services"

/**
 * Changes the selected tab and saves to back-end
 * @param  {String} selectedTab Name of tab
 * @return {Action}
 */
export function changeSelectedTab(selectedTab) {
  return (dispatch, getState) => {
    dispatch({ type: SAVE_TAB, payload: selectedTab })
    if (selector_tabIsMissing(getState(), selectedTab)) {
      dispatch({
        type: CREATE_TAB,
        payload: {
          tab: selectedTab,
          defaults: {
            name: selectedTab,
            dashlets: {},
            layouts: {},
          },
        },
      })
    }
  }
}
/**
 * Adds a dashlet to the indicated tab
 * @param  {String} dashlet dashlet reference name
 * @param  {String} tab     tab name
 * @return {Action}
 */
export function addDashlet(dashlet, tab) {
  return { type: ADD_DASHLET, payload: { tab, dashlet } }
}
/**
 * Removes a dashlet from the indicated tab
 * @param  {String} dashlet dashlet reference name
 * @param  {String} tab     tab name
 * @return {Action}
 */
export function removeDashlet(dashlet, tab) {
  return { type: REMOVE_DASHLET, payload: { tab, dashlet } }
}
/**
 * Changes the saved layout
 * @param  {Object} layouts layouts object from react-grid-layout
 * @param  {String} tab     tab name
 * @return {Action}
 */
export function changeLayout(layouts, tab) {
  return { type: CHANGE_LAYOUT, payload: { tab, layouts } }
}
// TODO Update when data is available immediately from JSP
/**
 * Gets dashboard settings from back-end
 * @return {Action}
 */
export function getDashboard() {
  return dispatch => {
    dispatch({ type: GET_DASHBOARD })
    fetchDashboard().then(({data}) => {
      const dashboardSettings = (data.dashboardSettings && data.dashboardSettings.tabs) ? data.dashboardSettings : selector_dashboardSettings(initialState)
      const Favorites = Object.values(data.availableDashlets).reduce((acc, val) => acc.concat(val), [])
      const availableDashlets = { ...data.availableDashlets, Favorites }
      // This code compares active dashlets to allowed dashlets, disabling active dashlets if they are no longer permitted
      const allowedDashlets = Favorites.map(dashlet => dashlet.id)
      Object.values(dashboardSettings.tabs).forEach(tab => {
        Object.keys(tab.dashlets).forEach(dashlet => {
          tab.dashlets[dashlet] = tab.dashlets[dashlet] && allowedDashlets.includes(dashlet)
        })
      })
      if (!dashboardSettings.currentTab) dashboardSettings.currentTab = TAB_FAVORITES
      // Ensures countries are upper case
      const countries = {}
      if (data.countries) {
        Object.keys(data.countries).forEach(country => {
          countries[country.toUpperCase()] = data.countries[country]
        })
      }
      dispatch(saveDashboard({ availableDashlets, countries, dashboardSettings }))
    })
  }
}

function saveDashboard(data) {
  return dispatch => {
    dispatch({ type: SAVE_DASHBOARD, payload: data })
  }
}
