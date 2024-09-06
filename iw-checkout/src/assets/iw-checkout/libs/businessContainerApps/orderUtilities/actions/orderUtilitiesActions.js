import * as Cart from '../../../models/Cart'
import * as constants from '../constants'

/**
 * I am uncertain whether we need an action creator for this at all. The model
 * behavior is *solely* side-effects. I've made an action creator to trigger the
 * effect so that the behavior is logged in the history of actions, to maintain
 * pattern consistency, and because perhaps we can use it like this later.
 * @return {Object<FSAction>} [description]
 */
export function exportCartAsXLS() {
    return {
        type: constants.EXPORT_CART_AS_XLS,
        payload: Cart.exportAsXLS(),
    }
}

/**
 * Toggle the visibility of the cart print preview modal.
 * @param  {Boolean} isOpen whether the modal should be visible or not
 * @return {Object<FSAction>}
 */
export function togglePrintPreview(isOpen) {
    return {
        type: constants.TOGGLE_PRINT_PREVIEW,
        payload: { isOpen },
    }
}
