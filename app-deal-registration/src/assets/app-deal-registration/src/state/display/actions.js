import { createAction } from '@state/helpers'
import {
    ADD_MODAL,
    ADD_TOAST,
    DISMISS_MODAL,
    DISMISS_TOAST
} from './types'

export const addModal = createAction(ADD_MODAL)
export const addToast = createAction(ADD_TOAST)

export const dismissModal = createAction(DISMISS_MODAL)
export const dismissToast = createAction(DISMISS_TOAST)