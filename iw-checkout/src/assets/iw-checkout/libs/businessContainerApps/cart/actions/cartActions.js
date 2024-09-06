import { destroy } from 'redux-form';

import { getUTCTimeStamp } from '@insight/toolkit-utils';
import { addToCartGAE, processCartGAE, removeFromCartGAE } from '@insight/toolkit-utils/lib/analytics';
import { nameThatForm } from '../helpers';
import initialState from '../../../../app/libs/initialState';
import * as Cart from '../../../models/Cart';
import * as constants from '../../../Cart/constants';
import { USER_INFORMATION_UPDATED } from '../../../User/constants';
import { attachRRProductWarrenties, callRichRelevanceRecommondations, getWarrantyMaterialIds } from '../../../models/Products';
import { getShoppingRequest } from '../../../ShoppingRequest/actions';
import { updateShippingCost } from './taxShippingEWRActions';
import { selector_cartItemGAE, selector_cartItemsGAE, selector_cart } from '../../../Cart/selectors/cartResponse';
import { selectRichRelavanceAPI } from '../../../Insight/selectors';
import { selector_lineLevelFormNames, selector_lineLevelFormNamesInBundle } from '../selectors';
import {
    selector_currencyCode,
    selector_isCES,
    selector_isDefaultLoggedOutUserEnabled,
    selector_locale,
    selector_userInformation
} from "../../../User/selectors";
import { getRRRecommendedByCartItems } from './../../../../app/ShoppingCart/actions/recommendationsActions';
import { callThirdPartyWarranties } from '../../../models/Products/recommendations';
import { RR_PLACEMENT_IDS } from '../../../../app/libs/constants';
import { selector_featureFlags } from '../../../flags/selectors';

const { rr_warranties, rr_warranties_qa, rr_accessories } = RR_PLACEMENT_IDS;

/**
 * used to get initial cart object on page load
 * @return {object} cart object which is used to populate cart state
 */
export function getCart() {
    return dispatch => {
        Cart.getCart()
            .then(cart => {
                dispatch(receiveCartResponse(cart))
            })
            .catch((error) => {
                console.log(error)
                dispatch({
                    type: `${constants.RECEIVE_CART_RESPONSE}_REJECTED`,
                })
            })
    }
}

/**
 * gets just cart and updates state
 * @returns {function(*)}
 */
export function getCartWithOutTaxAndShipping() {
    return (dispatch, getState) => {
        Cart.getCart()
            .then(cart => {
                dispatch({
                    type: constants.RECEIVE_CART_RESPONSE,
                    payload: cart,
                    globalState: getState(),
                })
                Cart.updateMiniCart()
            })
            .catch((error) => {
                console.log(error)
                dispatch({
                    type: `${constants.RECEIVE_CART_RESPONSE}_REJECTED`,
                })
            })
    }
}

/**
 * action to add items to cart
 * @param items
 * @returns {function(*=, *=)}
 */
export function addToCart(items) {
    return async (dispatch, getState) => {
        const state = getState();
        const richRelavanceAPI = selectRichRelavanceAPI(state);
        const isCES = selector_isCES(state);
        const isCesOrLogout = isCES || selector_isDefaultLoggedOutUserEnabled(state);

        // Third party warranties
        let invokeThirdPartyWarranties = selector_featureFlags(state)['GNA-8766-Third-Party-Warranty'] 
            && selector_locale(state)?.split('_')?.[1] === 'US' && selector_currencyCode(state) === 'USD';
        let requestForThirdParty = {};
        if (invokeThirdPartyWarranties) {
            const { webLoginProfileId, soldto, isIpsUser, webGroupId, salesOrg, currencyCode } = selector_userInformation(state);
            const product = items[0];
            requestForThirdParty = {
                contractID: product.contractID,
                ipsUser: isIpsUser,
                soldto,
                webLoginProfileId,
                wg: webGroupId,
                materialID: product.materialID,
                isCES,
                salesOrg,
                currencyCode,
            };
        }

        //CES flow
        if (isCesOrLogout) {
            try {
                const cartPlacementIds = richRelavanceAPI.includes('integration') ? `${rr_warranties_qa}|${rr_accessories}` : `${rr_warranties}|${rr_accessories}`;
                const body = Object.assign({}, {
                    productId: encodeURIComponent(items[0].materialID),
                    placementids: cartPlacementIds,
                    skipSearchResponse: true,
                    categoryId: '',
                });                

                const [
                    recommendationsData,
                    thirdPartyWarranties = []
                ] = await Promise.all([
                    callRichRelevanceRecommondations(body),
                    ...(invokeThirdPartyWarranties ? [callThirdPartyWarranties(requestForThirdParty)] : [])
                ]);

                // Manufacturer Warranties
                if ((!recommendationsData || !Array.isArray(recommendationsData) || !recommendationsData.length)) {
                    console.warn('Error(s) retrieving placements')
                }
                const placements = recommendationsData.reduce(
                    (obj, cur) => ({
                        ...obj,
                        [cur.placementId]: cur,
                    }),
                    {}
                )

                const accessories = placements[rr_accessories];
                const protection = placements[rr_warranties_qa] || placements[rr_warranties];
                const hasAccessories = accessories && accessories.prodList && accessories.prodList.length > 0;
                const warrantyMaterialIds = getWarrantyMaterialIds(protection, thirdPartyWarranties);
                const oldCart = selector_cart(getState());
                fireAddToCart(dispatch, items, hasAccessories, warrantyMaterialIds, oldCart, getState);
            } catch (e) {
                console.warn('Error(s) fetching getRecommendations/3rd party warrranties: ', e);
            }
        }
        //Legacy flow
        else {
            return attachRRProductWarrenties(items, richRelavanceAPI)
                .catch((err) => {
                    console.log(err)
                })
                .then(async (protection) => {
                    const manufacturerWarranties = protection?.reduce((prev, item) => [
                        ...prev,
                        ...item?.warrantyMaterialIds
                    ], []) || [];

                    // for adding 3rd party warranties
                    let thirdPartyList = [];
                    if (invokeThirdPartyWarranties) {
                        thirdPartyList = await callThirdPartyWarranties(requestForThirdParty);
                    }
                    const thirdPartyWarranties = getWarrantyMaterialIds([], thirdPartyList);
                    const warrantyMaterialIds = [
                        ...thirdPartyWarranties,
                        ...manufacturerWarranties,
                    ];

                    const oldCart = selector_cart(getState())
                    // legacy user does not need to send hasAccessories, it is determined from backend
                    fireAddToCart(dispatch, items, null, warrantyMaterialIds, oldCart, getState)
                })
        }
    }
}

export function fireAddToCart(dispatch, items, hasAccessories, warrantyMaterialIds, oldCart, getState) {
    const cartReq = [{
        clientBrowserDate: getUTCTimeStamp(),
        materialID: items?.[0].materialID,
        quantity: items?.[0].quantity,
        contractID: items?.[0].contractID,
        hasAccessories,
        warrantyMaterialIds,
        requestFromViewCartQuickAdd: items?.[0].requestFromViewCartQuickAdd
    }]
    console.log('acartReq ', cartReq)
    return Cart.addToCart(cartReq)
        .then(result => {
            dispatch(receiveCartResponse(result.cart))
            items.forEach((item) => {
                const materialIDs = item.materialID.split(',')
                materialIDs.forEach((materialID) => {
                    addToCartGAE(oldCart, [{ ...selector_cartItemGAE(getState(), materialID), quantity: item.quantity }]);
                    processCartGAE(result.cart);
                })
            })
        })
}

/**
 * Add OEM warranty to cart
 * @param {[type]} item [description]
 */
export function addOEMToCart(item) {
    return dispatch => {
        dispatch({
            // will use this action in future to show error message to user on failure
            type: constants.ADD_OEM_WARRANTY_TO_CART,
            payload: Cart.addOEMToCart(item)
                .then(cart => {
                    dispatch(receiveCartResponse(cart))
                    return cart
                }),
        })
    }
}

/**
 * Add IPP warranty to cart
 * @param {[type]} item [description]
 */
export function addIPPToCart(item) {
    return dispatch => {
        dispatch({
            // will use this action in future to show error message to user on failure
            type: constants.ADD_IPP_WARRANTY_TO_CART,
            payload: Cart.addIPPToCart(item)
                .then(cart => {
                    dispatch(receiveCartResponse(cart))
                    return cart
                }),
        })
    }
}

/**
 * delete a single item from cart
 * @param  {object} item [materialID(which is materialIDKey), contractID]
 * @return {object}      [payload will be cart response]
 */
export function deleteFromCart(item, bundleHeader) {
    return (dispatch, getState) => {
        const oldCart = selector_cart(getState());
        Cart.deleteFromCart(item)
            .then(cart => {
                if (bundleHeader) {
                    dispatch(destroy(...selector_lineLevelFormNamesInBundle(getState(), item)))
                } else {
                    dispatch(destroy(nameThatForm(item.contractID, '0', item.materialID)))
                }
                removeFromCartGAE(oldCart, selector_cartItemGAE(getState(), null, item.contractID, item.materialID))
                processCartGAE(cart);
                dispatch(clearCartItemInCartView(item))
                dispatch(receiveCartResponse(cart))
            })
            .catch((error) => {
                console.log(error)
                dispatch({
                    type: `${constants.RECEIVE_CART_RESPONSE}_REJECTED`,
                })
            })
    }
}

/**
 * removes all items from the cart
 * @return {object} response is the cart object with no contracts
 */
export function emptyCart() {
    return (dispatch, getState) => {
        const oldCart = selector_cart(getState());
        dispatch({
            type: constants.RECEIVE_CART_RESPONSE,
            globalState: getState(),
            payload: Cart.emptyCart()
                .then(cart => {
                    // clear lineLevel form state
                    const listOfLineLevelForms = selector_lineLevelFormNames(getState())
                    dispatch(destroy(...listOfLineLevelForms))
                    // update minicart in header
                    Cart.updateMiniCart()
                    dispatch(clearCartInCartView(cart))
                    dispatch(getShoppingRequest()) // Removing cart from shopping request
                    removeFromCartGAE(oldCart, selector_cartItemsGAE(getState()))
                    processCartGAE(cart);
                    return cart
                })
                .catch(() => initialState.cart),
        })
    }
}

/**
 * A generic action to receive whole cart responses.
 * Most services interacting with the cart respond with their entire representation
 * of the cart so we have decided to segment this into its own piece of state.
 * @param  {[type]} cart [description]
 * @return {Object<FSAction>}      [description]
 */
export function receiveCartResponse(cart) {
    return (dispatch, getState) => {
        // update minicart in header only when number of items updated
        const previousCart = selector_cart(getState())
        if (previousCart.totalCount !== cart.totalCount) {
            Cart.updateMiniCart()
        }
        dispatch({
            type: constants.RECEIVE_CART_RESPONSE,
            payload: cart,
            globalState: getState(),
        })

        dispatch(updateShippingCost(cart))

        // receive cart response action is only meant for view cart page. if otherwise we need to check for route
        // below is only needed on view cart and receipt page to fetch updated recommendations
        dispatch(getRRRecommendedByCartItems(cart))
        // Clear tentative cart quantity changes
        // dispatch({type: constants.CLEAR_TENTATIVE_CART_ITEM_QUANTITY})
    }
}

/**
 * on empty cart clear normalized state
 * @param  {[type]} cart [description]
 * @return {Object<FSAction>}      [description]
 */
export function clearCartInCartView(cart) {
    return {
        type: constants.CLEAR_NORMALIZED_CART,
        payload: cart,
    }
}

/**
 * on delete item from cart, we also need to clean normalized cart
 * @param  {[type]} cart [description]
 * @return {Object<FSAction>}      [description]
 */
export function clearCartItemInCartView(item) {
    return {
        type: constants.CLEAR_ITEM_FROM_NORMALIZED_CART,
        payload: {
            contractID: item.contractID,
            materialIDKey: item.materialID,
        },
    }
}

/**
 * this action sets loading wheel on cart page
 * @param payload
 * @returns {{type, payload: boolean}}
 */
export function setCartIsPending(payload = true) {
    return {
        type: constants.UPDATE_CART_PENDING_STATUS,
        payload,
    }
}

/**
 * this action is to reset mini cart in header to empty
 * @returns {function(*)}
 */
export function clearMiniCart() {
    return dispatch => {
        // update minicart in header
        // we dont want to update cart in state as we need it for receipt page details
        Cart.updateMiniCart()
    }
}

/** Update showProductImages flag in userInformation object **/
export function updateUserInfo(userInfo) {
    return {
        type: USER_INFORMATION_UPDATED,
        payload: userInfo,
    }
}

/**
 * on click on show/hide pictures trigger user info
 * @param  {}
 * @return {Object<UserInfo>}
 */
export function userInformation() {
    return (dispatch) => {
        dispatch({
            type: USER_INFORMATION_UPDATED,
            payload: Cart.getUserInformation()
                .then(data => {
                    dispatch(updateUserInfo(data))
                    return data
                })
        })
    }
}

/**
 * sets quick checkout flag used for GTM
 * @param quickCheckout
 * @returns {{type, payload: boolean}}
 */
export function setQuickCheckout(quickCheckout = false) {
    return {
        type: constants.SET_QUICK_CHECKOUT,
        payload: quickCheckout,
    }
}
