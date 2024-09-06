import InitialState from '../../libs/initialState'
import { getQuickShop } from './../../../libs/Cart/selectors'
import * as constants from './../../libs/constants';
import reduce from 'lodash-es/reduce'

export function quickShop(state = getQuickShop(InitialState), { type, payload }) {
    switch (type) {
        case `${constants.VALIDATE_MATERIALS}_FULFILLED`:
            return {
                ...state,
                validatedMaterials: payload,
                isMultipleSKUFound: true, // yv - a workaround for the messaging component to be tested.
                relatedItems: payload.duplicateManufaturerProductsMap &&
                    reduce(payload.duplicateManufaturerProductsMap, (acc, relatedItems) => acc.concat(relatedItems), []),
            }
        case `${constants.VALIDATE_MATERIALS}_PENDING`:
            return {
                ...state,
                isPending: true,
            }
        case `${constants.VALIDATE_MATERIALS}_REJECTED`:
            return state
        case `${constants.UPDATE_QUICK_SHOP_MATERIALS_QTY}`:
            return {
                ...state,
                materialIdString: payload.materialIdString,
                quantity: payload.quantity,
            }
        case `${constants.SHOW_DIALOG_QUICK_SHOP_MULTIPLE_OPTIONS}`:
            return {
                ...state,
                isMultipleSKUFound: payload,
            }
        default: return state
    }
}
