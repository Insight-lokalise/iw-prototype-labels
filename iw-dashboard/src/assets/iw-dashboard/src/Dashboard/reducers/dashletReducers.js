/* eslint-disable import/prefer-default-export */
import {
  EDIT_DASHLET_BACKTEXT,
  EDIT_DASHLET_COMPARISON,
  EDIT_DASHLET_COUNTRY,
  EDIT_DASHLET_CURRENCY,
  EDIT_DASHLET_FILTERS,
  EDIT_DASHLET_MANUFACTURER,
  EDIT_DASHLET_PUBLISHER,
  EDIT_DASHLET_REGION,
  EDIT_DASHLET_SORTINGCATEGORY,
  EDIT_DASHLET_SUBCATEGORY,
  EDIT_DASHLET_TIMEFRAME,
  GET_POWERBI_DATA,
  GET_WELCOME_DATA,
  SAVE_POWERBI_DATA,
  SAVE_WELCOME_DATA,
} from '../actionTypes'
import initialState from '../../config/initialState'

export function dashletSettings(state = initialState.dashletSettings, action) {
  if (action.payload && action.payload.tab) {
    const { tab, dashlet, setting } = action.payload
    const nextState = { ...state }
    nextState[tab] = nextState[tab] ? { ...state[tab] } : {}
    nextState[tab][dashlet] = nextState[tab][dashlet] ? { ...state[tab][dashlet] } : {}
    switch (action.type) {
      case EDIT_DASHLET_COUNTRY: {
        nextState[tab][dashlet].country = setting
        return nextState
      }
      case EDIT_DASHLET_REGION: {
        nextState[tab][dashlet].region = setting
        return nextState
      }
      case EDIT_DASHLET_MANUFACTURER: {
        nextState[tab][dashlet].manufacturer = setting
        return nextState
      }
      case EDIT_DASHLET_CURRENCY: {
        nextState[tab][dashlet].currency = setting
        return nextState
      }
      case EDIT_DASHLET_SUBCATEGORY: {
        nextState[tab][dashlet].subCategory = setting
        return nextState
      }
      case EDIT_DASHLET_SORTINGCATEGORY: {
        nextState[tab][dashlet].sortingCategory = setting
        return nextState
      }
      case EDIT_DASHLET_FILTERS: {
        nextState[tab][dashlet].filters = { ...nextState[tab][dashlet].filters, ...setting }
        return nextState
      }
      case EDIT_DASHLET_COMPARISON: {
        nextState[tab][dashlet].isCompared = setting.isCompared
        nextState[tab][dashlet].disableComparison = setting.disableComparison
        return nextState
      }
      case EDIT_DASHLET_BACKTEXT: {
        nextState[tab][dashlet].backText = action.payload.backText
        return nextState
      }
      case EDIT_DASHLET_TIMEFRAME: {
        nextState[tab][dashlet].timeFrame = action.payload.timeFrame
        return nextState
      }
      case EDIT_DASHLET_PUBLISHER: {
        nextState[tab][dashlet].publisher = setting
        return nextState
      }
      default:
        return state
    }
  }
  return state
}

export function Welcome(state = {}, { payload, type }) {
  switch (type) {
    case GET_WELCOME_DATA: {
      return { ...state, hasData: false }
    }
    case SAVE_WELCOME_DATA: {
      return { ...state, hasData: true, data: payload }
    }
    default: {
      return state
    }
  }
}

export function powerBI(state = {}, { payload, type }) {
  switch(type) {
    case GET_POWERBI_DATA: {
      return { ...state, [payload]: false }
    }
    case SAVE_POWERBI_DATA: {
      const { id, data } = payload
      return { ...state, [id]: data }
    }
    default: {
      return state
    }
  }
}