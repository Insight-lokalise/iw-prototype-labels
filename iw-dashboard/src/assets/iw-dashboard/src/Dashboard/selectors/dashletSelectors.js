/* eslint-disable import/prefer-default-export */
import { selector_currentTab } from './settingsSelectors'

export function selector_dashletSettings_currentTab_dashlet(state, dashletName) {
  return selector_dashletSettings_tab(state, selector_currentTab(state))[dashletName] || {}
}
function selector_dashletSettings_tab(state, tab) {
  return selector_dashletSettings(state)[tab] || {}
}
function selector_dashletSettings(state) {
  return state.dashletSettings || {}
}

export function selector_Welcome(state) {
  return state.Welcome || null
}

export function selector_powerBI(state, id) {
  return state.powerBI && state.powerBI[id] || {}
}