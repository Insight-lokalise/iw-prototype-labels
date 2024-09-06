import {
  ADD_PIN,
  CLEAR_FILTERS,
  GET_USERDATA,
  FETCH_PRODUCT_SETS,
  SAVE_CATEGORIES,
  SAVE_LOCALE,
  SAVE_PINS,
  SAVE_PRODUCT_GROUPS,
  SAVE_PRODUCT_SETS,
  SAVE_TAGS,
  SAVE_USERDATA,
  SAVE_USER_SETTINGS,
  SAVE_WEB_GROUP_SETTINGS,
  TOGGLE_FILTER,
} from './types'

export function categories(state = {}, { type, payload }) {
  switch(type) {
    case SAVE_CATEGORIES: {
      return payload
    }
    default: {
      return state
    }
  }
}

export function locale(state = 'en_US', { type, payload }) {
  switch(type) {
    case SAVE_LOCALE: {
      return payload
    }
    default: {
      return state
    }
  }
}

export function pins(state = [], { type, payload }) {
  switch(type) {
    case ADD_PIN: {
      return [ ...state, payload ]
    }
    case SAVE_PINS: {
      return payload
    }
    default: {
      return state
    }
  }
}

export function productGroups(state = {}, { type, payload }) {
  switch(type) {
    case SAVE_PRODUCT_GROUPS: {
      return payload
    }
    default: {
      return state
    }
  }
}

export function productSets(state = {}, { type, payload }) {
  switch(type) {
    case FETCH_PRODUCT_SETS: {
      return { ...state, isPending: true }
    }
    case SAVE_PRODUCT_SETS: {
      return { ...state, isPending:false, [payload.id]: payload.data }
    }
    default: {
      return state
    }
  }
}

export function tags(state = { pins: { filterBy: false }}, { type, payload }) {
  switch(type) {
    case CLEAR_FILTERS: {
      const newState = { ...state }
      Object.keys(newState).forEach(id => {
        newState[id] = { ...state[id] }
        newState[id].filterBy = false
      })
      return newState
    }
    case SAVE_TAGS: {
      return payload
    }
    case TOGGLE_FILTER: {
      const tag = { ...state[payload] }
      tag.filterBy = !tag.filterBy
      return { ...state, [payload]: tag}
    }
    default: {
      return state
    }
  }
}

export function userSettings(state = {}, { type, payload }) {
  switch(type) {
    case SAVE_USER_SETTINGS: {
      return { ...state, ...payload }
    }
    default: {
      return state
    }
  }
}

export function webGroupSettings(state = {}, { type, payload }) {
  switch(type) {
    case SAVE_WEB_GROUP_SETTINGS: {
      return payload
    }
    default: {
      return state
    }
  }
}

export function userData(state = { isLoading: true }, action) {
  switch (action.type) {
    case GET_USERDATA: {
      const nextState = { isLoading: true }
      return nextState
    }
    case SAVE_USERDATA: {
      const nextState = action.payload
      return nextState
    }
    default:
      return state
  }
}
