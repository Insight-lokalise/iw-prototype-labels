import {
    DEP_ITEMS_SPLIT_SUCCESSFULLY,
    EXISTING_ENROLLMENT_IDS,
    EXISTING_INFO_SUBMITTED_SUCCESSFULLY,
    UPDATE_TENTATIVE_CART_ITEM_DEP_INFO,
    DEP_INFO_COPY_TO_ALL_IN_CONTRACT,
} from "../constants";
import * as Cart from '../../../models/Cart'
import {selector_cartItemsEnrollment} from "../../../Cart/selectors";
import {enrollmentInfoToUpdate} from "../helpers";
import * as constants from "../../../Cart/constants";

/**
 * get all enrollment ID's registered with Insight
 * @returns {{type, payload: object}}
 */

export function getEnrollmentIDs() {
    return {
        type: EXISTING_ENROLLMENT_IDS,
        payload: Cart.existingEnrollmentIDs()
    }
}

/**
 * submit all enrollment information
 * @returns {{type, payload: object}}
 */

export function submitEnrollmentValues(param) {
    return (dispatch, getState) => {
        return Cart.setEnrollmentInfo(param)
            .then(response => {
                dispatch({
                    type: EXISTING_INFO_SUBMITTED_SUCCESSFULLY,
                    payload: response,
                })
                dispatch({
                    type: constants.RECEIVE_CART_RESPONSE,
                    payload: response,
                    globalState: getState(),
                })
                return response
            })
    }
}


/**
 * Update the appropriate cartItemView's tentative DEP selected values to store
 * before the user presses the checkout button.
 * @param  {Object} updateDetails of shape { contractId<String>,
 *                                           customerId<String>,
 *                                           DEPChecked<Boolean>,
 *                                           materialIDKey<String>,
 *                                           quantity<Number> }
 * @return {Object<FSAction>}               (Flux Standard Action)
 */
export function updateTentativeDEPValues(updateDetails) {
    return {
        type: UPDATE_TENTATIVE_CART_ITEM_DEP_INFO,
        payload: updateDetails,
    }
}

/**
 *
 * @param  {Object} copy DEP info to all items in contract, params of shape { contractId<String>,
 *                                           materialIDKey<String> }
 * @return {Object<FSAction>}               (Flux Standard Action)
 */
export function copyDEPValues(params) {
    return {
        type: DEP_INFO_COPY_TO_ALL_IN_CONTRACT,
        payload: params,
    }
}

/**
 * split DEP items based on cart quantity and update the cart
 */

export function splitItems(param){
    return (dispatch, getState) => {
        const enrollmentInfo = selector_cartItemsEnrollment(getState())
        const {hasEnrollmentInfoToUpdate, optInPartners, optOutPartners} = enrollmentInfoToUpdate(enrollmentInfo)
        if(hasEnrollmentInfoToUpdate) {
            Cart.setEnrollmentInfo({enrollments: optInPartners , removedIds: optOutPartners })
                .then(response => {
                    dispatch({
                        type: EXISTING_INFO_SUBMITTED_SUCCESSFULLY,
                        payload: response,
                    })
                    Cart.splitItems(param)
                        .then( response => {
                            dispatch({
                                type: DEP_ITEMS_SPLIT_SUCCESSFULLY,
                                payload: response,
                            })
                            dispatch({
                                type: constants.RECEIVE_CART_RESPONSE,
                                payload: response.cart,
                                globalState: getState(),
                            })
                        })
                })
        } else {
            Cart.splitItems(param)
                .then( response => {
                    dispatch({
                        type: DEP_ITEMS_SPLIT_SUCCESSFULLY,
                        payload: response,
                    })
                    dispatch({
                        type: constants.RECEIVE_CART_RESPONSE,
                        payload: response.cart,
                        globalState: getState(),
                    })
                })
        }

    }
}


