import { store } from './storeConfig'

import { receiveCartResponse } from './../../libs/businessContainerApps/cart/actions'
import { loadInsightApplicationData } from './../../libs/InsightApplicationData/actions'
import {
    loadUser,
    receiveDefaultCarrierResponse,
    receiveDefaultShippingAddressResponse,
    receiveDefaultBillingAddressResponse,
} from './../../libs/User/actions'

const { dispatch } = store

export function reduxInit() {
    dispatch(loadUser())
    dispatch(loadInsightApplicationData())
    dispatch(receiveDefaultCarrierResponse(window.__dataFromModelForInitalLoad.defaultShipCarrier))
    dispatch(receiveDefaultShippingAddressResponse(window.__dataFromModelForInitalLoad.defaultShippingAddress))
    dispatch(receiveDefaultBillingAddressResponse(window.__dataFromModelForInitalLoad.defaultBillingAddress))
    dispatch(receiveCartResponse(window.__dataFromModelForInitalLoad.cart))
}
