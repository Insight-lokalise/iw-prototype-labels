import { ADD_MODAL, ADD_TOAST, DISMISS_MODAL, DISMISS_TOAST } from './types'

const initialState = {
    modalProps: null,
    modalType: '',
    toasts: []
}

export default function displayReducer(state = initialState, { payload, type }) {
    switch (type) {
        case ADD_MODAL: return { ...state, modalProps: payload.modalProps, modalType: payload.modalType }
        case ADD_TOAST: return { ...state, toasts: state.toasts.concat(payload) }
        case DISMISS_MODAL: return { ...state, modalProps: null, modalType: '' }
        case DISMISS_TOAST: return { ...state, toasts: state.toasts.filter(({ id }) => id !== payload.id)}
        default: return state        
    }
}