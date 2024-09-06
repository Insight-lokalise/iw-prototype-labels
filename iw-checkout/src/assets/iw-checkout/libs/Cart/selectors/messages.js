import get from 'lodash-es/get'

export const selector_messages = state => get(state, 'messageBoxes', null)
export const selector_shoppingCartMessageBox = state => selector_messages(state)['shopping-cart'] || {}
export const selector_shoppingCartMessageBoxMessages = state => selector_shoppingCartMessageBox(state).messages || []

// TODO refactor
export const selector_shoppingCartHasErrorMessages = state => {
    const messages = selector_shoppingCartMessageBoxMessages(state).slice()
    for (let i = 0; i < messages.length; i++) {
        if (messages[i].severity === 'error') {
            return true
        }
    }
    return false
}

export const selectErrorMessages = (state, boxId) => get(state, ['messageBoxes', boxId, 'messages'], []).filter(message => message.severity === 'error')
