import { DRAG_TYPES } from '../constants'

export default function dragReducer(state, { payload, type }) {
    switch (type) {
        case (type === DRAG_TYPES['drag-start']): {
            return { ...state, ...payload }
        }
        case (type === DRAG_TYPES['drag-stop']): {
            return { ...state, isDragging: false }
        }
        case (type === DRAG_TYPES['hide-outline']): {
            return { ...state, showOutline: false }
        }
        case (type === DRAG_TYPES['set-dragging']): {
            return { ...state, isDragging: true }
        }
        case (type === DRAG_TYPES['show-outline']): {
            return { ...state, showOutline: true }
        }
        default: {
            throw new Error(`Unrecognized type passed to dragReducer: ${type}`)
        }
    }
}