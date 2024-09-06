import { TAB_FAVORITES } from '../components/constants'

export function selector_dashboard(state) {
  return state.dashboard || {}
}
export function selector_dashboardSettings(state) {
  return selector_dashboard(state).dashboardSettings || {}
}
export function selector_availableDashlets(state) {
  return selector_dashboard(state).availableDashlets || {}
}
export function selector_currentTab(state) {
  return selector_dashboardSettings(state).currentTab || TAB_FAVORITES
}
export function selector_countries(state) {
  return selector_dashboard(state).countries || {}
}
export function selector_dashboardTabs(state) {
  return selector_dashboardSettings(state).tabs || {}
}
export function selector_tabIsMissing(state, tab) {
  return !selector_dashboardTabs(state)[tab]
}

