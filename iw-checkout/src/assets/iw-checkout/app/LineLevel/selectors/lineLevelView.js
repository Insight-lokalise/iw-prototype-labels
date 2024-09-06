export const selector_lineLevelView = state => state.lineLevelView

export const selector_additionalInformation = state => selector_lineLevelView(state).additionalOrderInformation

export const selector_isSaveAsQuote = state => selector_lineLevelView(state).isSaveAsQuote