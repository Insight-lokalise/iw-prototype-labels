import * as constants from './constants'

export function create(boxId, options) {
    return {
        type: constants.CREATE_MESSAGEBOX,
        payload: { boxId, options },
    }
}

export function addMessage(boxId, message) {
    return {
        type: constants.ADD_MESSAGE,
        payload: { boxId, message },
    }
}

export function clear(boxId) {
    return {
        type: constants.CLEAR_MESSAGEBOX,
        payload: { boxId },
    }
}

export function removeMessage(boxId, msgId) {
    return {
        type: constants.REMOVE_MESSAGE,
        payload: { boxId, msgId },
    }
}
