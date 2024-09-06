export function selector_userData(state) {
  return state.userData || {}
}
export function selector_defaultCurrency(state) {
  return selector_userData(state).currencyCode || null
}

export const selector_locale = state => selector_userData(state).locale

export const selector_monthNames = state => selector_userData(state).monthNames
