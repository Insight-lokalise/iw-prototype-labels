import * as constants from './../../../app/libs/constants'
import * as AdditionalOrderInformation from './../../models/AdditionalOrderInformation'
import * as OrderMetaData from './../../models/OrderMetaData/orderMetaData'
import * as orderMetaDataConstants from './../constants'

export function fetchSmartTrackers() {
    return {
        type: constants.GET_HEADER_LEVEL_SMARTTRACKERS,
        payload: AdditionalOrderInformation.fetchSmartTrackers(),
    }
}

export function saveHeaderLevelSmartTrackerDefaults(payload) {
    return {
        type: constants.UPDATE_HEADER_LEVEL_SMARTTRACKER_DEFAULTS,
        payload: AdditionalOrderInformation.saveHeaderLevelSmartTrackerDefaults(payload),
    }
}

export function fetchPopulateUIFlags() {
    return {
        type: constants.GET_TRANSACTION_FLAGS,
        payload: AdditionalOrderInformation.fetchPopulateUIFlags(),
    }
}

export function saveAdditionalOrderInformation(payload) {
    return {
        type: constants.UPDATE_ADDITIONAL_ORDER_INFORMATION,
        payload: AdditionalOrderInformation.saveAdditionalOrderInformation(payload)
            .then(() => payload),
    }
}

export function fetchOrderMetaData(isSharedUser) {
    return {
        type: orderMetaDataConstants.GET_ORDER_METADATA,
        payload: OrderMetaData.fetchOrderMetaData(isSharedUser),
    }
}

export function uploadFile(payload) {
    return {
        type: orderMetaDataConstants.UPLOAD_FILE,
        payload: OrderMetaData.uploadFile(payload),
    }
}
export function deleteFile() {
    return {
        type: orderMetaDataConstants.DELETE_FILE,
        payload: OrderMetaData.deleteFile(),
    }
}
