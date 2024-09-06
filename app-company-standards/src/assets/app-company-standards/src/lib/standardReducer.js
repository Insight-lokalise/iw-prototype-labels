/*
This is a "standard reducer factory" that returns a normal reducer specifically for use
with useReducer. When used, it returns a reducer with 4 basic action types (though you
can expand them via the customActions argument). The initialState argument is also
optional, and only needed if you plan to use RESET since you must supply an initialState
to useReducer anyways.
 */
export default function createReducer(initialState = {}, customActions = {}) {
  const actions = {
    SET: (state, payload) => ({ ...state, ...payload}),
    REPLACE: (state, payload) => payload,
    RESET: () => initialState,
    CLEAR: () => ({}),
    ...customActions,
  }
  return function reducer(state = initialState, { payload, type }) {
    if (!actions[type]) {
      console.warn(`${type} is not a valid type.`)
      return state
    }
    return actions[type](state, payload)
  }
}