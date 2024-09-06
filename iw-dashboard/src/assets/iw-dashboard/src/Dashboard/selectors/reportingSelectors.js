export function selector_prevAPICalls(state, dashletName) {
  return state[dashletName] || {}
}

export function selector_SBProduct(state, fetchPath) {
  return selector_prevAPICalls(state, 'SBProduct')[fetchPath] || false
}

export function selector_SBManufacturer(state, fetchPath) {
  return selector_prevAPICalls(state, 'SBManufacturer')[fetchPath] || false
}
