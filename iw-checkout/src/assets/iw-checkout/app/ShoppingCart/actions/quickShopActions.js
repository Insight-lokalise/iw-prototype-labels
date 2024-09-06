import { addToCart, setCartIsPending } from './../../../libs/businessContainerApps/cart/actions'
import { validateMaterials, isValidMaterials, hasManufaturerProducts, hasInvalidMaterials } from './../../../libs/models/Cart/quickshop'
import * as constants from './../../libs/constants';
import msgBox from './../../../libs/iw-components/iw-messageBox'
import { t } from '@insight/toolkit-utils/lib/labels'

/**
 * Makes a call to compare products and dispatches appropriate events to update redux state
 * @param {[string]} materialIdString [refers to materialIds seperated by comma]
 * @param {[number]} quantity         [quantity]
 */
export function addToQuickShop(materialIdString, quantity) {
    return dispatch => {
        dispatch(setCartIsPending())
        validateMaterials(materialIdString)
            .then(data => {
                msgBox.clear('quick-shop')
                if (isValidMaterials(data)) {
                    /* add valid materials to cart only when no manufacture duplicate parts not found */
                    const item = [{
                        requestFromViewCartQuickAdd: true,
                        materialID: data.validMaterialIds.join(','),
                        quantity: quantity,
                    }]
                    dispatch(addToCart(item))
                        .then(showPartsAddedMessage)
                }
                if (hasManufaturerProducts(data)) {
                    /* alert user about manufacture duplicate parts found,
                    based on user decession add selected parts including valid materials */
                    dispatch(setCartIsPending(false))
                    dispatch({
                        type: `${constants.VALIDATE_MATERIALS}_FULFILLED`,
                        payload: data,
                    })
                }
                if (hasInvalidMaterials(data)) {
                    /* alert user by displaying message for any invalid materails in any case */
                    dispatch(setCartIsPending(false))
                    msgBox.addMsg('quick-shop', {
                        text: `${t('Please enter a valid part number.')} ${data.invalidMaterialIds.join(',')}`,
                        severity: 'error',
                    })
                }
            })
            .catch((error) => {
                console.warn('Failed to validate materials', error)
                /* reduce data to quick shop reducers to update user view*/
                dispatch({
                    type: `${constants.VALIDATE_MATERIALS}_REJECTED`,
                })
            })

        dispatch({
            type: constants.UPDATE_QUICK_SHOP_MATERIALS_QTY,
            payload: { materialIdString, quantity },
        })
    }
}

/**
 * action to handle user selected items from 'multiple items modal'
 * @param  {[array]} items    [selected material IDs]
 * @param  {[number]} quantity [selected quantity, all materials will be added with this quantity]
 * @return {[dispatch]}          [dispatch]
 */
export function addToQuickShopFromModal(items, quantity) {
    return dispatch => {
        if (items && items.length > 0) {
            dispatch(setCartIsPending())
            const body = [{
                requestFromViewCartQuickAdd: true,
                materialID: items.join(','),
                quantity: quantity,
            }]
            dispatch(addToCart(body))
                .then(showPartsAddedMessage)
        }
        dispatch(openMultipleItemsDialog(false))
    }
}

export function openMultipleItemsDialog(flag) {
    return {
        type: constants.SHOW_DIALOG_QUICK_SHOP_MULTIPLE_OPTIONS,
        payload: flag,
    }
}

let timeoutId
function showPartsAddedMessage() {
    if (timeoutId) clearTimeout(timeoutId)
    if (!msgBox.hasMsg('shopping-cart', 'quickShopAddedToCart')) {
        msgBox.addMsg('shopping-cart', {
            msgId: 'quickShopAddedToCart',
            text: t('Part(s) added to the cart.'),
            severity: 'success',
            scrollTo: '.shopping-cart__messages',
        })
    }
    timeoutId = setTimeout(() => {
        msgBox.removeMsg('shopping-cart', 'quickShopAddedToCart')
        timeoutId = null
    }, 6000)
}
