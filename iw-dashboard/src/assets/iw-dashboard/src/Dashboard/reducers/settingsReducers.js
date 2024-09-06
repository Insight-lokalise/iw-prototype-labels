import {
  ADD_DASHLET,
  CHANGE_LAYOUT,
  CREATE_TAB,
  GET_DASHBOARD,
  REMOVE_DASHLET,
  SAVE_DASHBOARD,
  SAVE_TAB,
} from '../actionTypes'
import initialState from '../../config/initialState'

export function availableDashlets(state = initialState.dashboard.availableDashlets, action) {
  switch (action.type) {
    case SAVE_DASHBOARD: {
      return action.payload.availableDashlets || initialState.dashboard.availableDashlets
    }
    default:
      return state
  }
}

export function countries(state = {}, action) {
  switch (action.type) {
    case SAVE_DASHBOARD: {
      return action.payload.countries || initialState.dashboard.countries
    }
    default:
      return state
  }
}

export function dashboardSettings(state = initialState.dashboard.dashboardSettings, action) {
  switch (action.type) {
    case GET_DASHBOARD: {
      return { ...state, isLoading: true }
    }
    case SAVE_DASHBOARD: {
      return action.payload.dashboardSettings || initialState.dashboard.dashboardSettings
    }
    case SAVE_TAB: {
      const nextState = { ...state }
      nextState.currentTab = action.payload
      return nextState
    }
    case ADD_DASHLET: {
      const { tab, dashlet } = action.payload
      const nextState = { ...state }
      nextState.tabs = nextState.tabs ? { ...state.tabs } : {}
      nextState.tabs[tab] = nextState.tabs[tab] ? { ...state.tabs[tab] } : {}
      nextState.tabs[tab].dashlets = nextState.tabs[tab].dashlets ? { ...state.tabs[tab].dashlets } : {}
      nextState.tabs[tab].dashlets[dashlet] = true
      return nextState
    }
    case REMOVE_DASHLET: {
      const { tab, dashlet } = action.payload
      const nextState = { ...state }
      nextState.tabs = nextState.tabs ? { ...state.tabs } : {}
      nextState.tabs[tab] = nextState.tabs[tab] ? { ...state.tabs[tab] } : {}
      nextState.tabs[tab].dashlets = nextState.tabs[tab].dashlets ? { ...state.tabs[tab].dashlets } : {}
      nextState.tabs[tab].dashlets[dashlet] = false
      return nextState
    }
    case CHANGE_LAYOUT: {
      const { tab, layouts } = action.payload
      const nextState = { ...state }
      nextState.tabs = nextState.tabs ? { ...state.tabs } : {}
      nextState.tabs[tab] = nextState.tabs[tab] ? { ...state.tabs[tab] } : {}
      nextState.tabs[tab].layouts = layouts
      return nextState
    }
    case CREATE_TAB: {
      const { tab, defaults } = action.payload
      const nextState = { ...state }
      nextState.tabs = nextState.tabs ? { ...state.tabs } : {}
      nextState.tabs[tab] = defaults
      return nextState
    }
    default:
      return { ...state }
  }
}
