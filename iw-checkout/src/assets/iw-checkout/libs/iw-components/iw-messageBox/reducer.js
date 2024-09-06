import * as constants from './constants'

export function messageBoxes(state = {}, { type, payload }) {
    switch (type) {
        default: return state
        case constants.CREATE_MESSAGEBOX:
            return {
                ...state,
                [payload.boxId]: {
                    boxId: payload.boxId,
                    ...payload.options,
                },
            }
        case constants.ADD_MESSAGE:
            return {
                ...state,
                [payload.boxId]: {
                    ...state[payload.boxId],
                    messages: state[payload.boxId].messages.concat(payload.message),
                },
            }
        case constants.CLEAR_MESSAGEBOX:
            return {
                ...state,
                [payload.boxId]: {
                    ...state[payload.boxId],
                    messages: [],
                },
            }
        case constants.REMOVE_MESSAGE:
            return {
                ...state,
                [payload.boxId]: {
                    ...state[payload.boxId],
                    messages: state[payload.boxId].messages.filter(msg => msg.msgId !== payload.msgId),
                },
            }
        // case constants.DELETE_MESSAGE:
        //     return filter(state, message => message.msgId !== payload.msgId)
    }
}
