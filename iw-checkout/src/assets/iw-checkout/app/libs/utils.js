import React from 'react'
import { t } from '@insight/toolkit-utils/lib/labels'
/**
 *  This is used to generate a unique UUID/GUID (122bit + 6 reserved bits) id for html elements. 
 *  This is based on timestamps. If the timestamps are taken more than 1ms apart then there should
 *  be no worry about collisions. In addition, since id's are using sparingly collisions
 *  should not be a concern
 */
export default function generateUniqueId(id = '') {
	const unique = Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36)
	return id !== '' ? `${id}-${unique}` : `${unique}`
}

export function showCarrierChargeMessage(hideForEmail='') {
	return  (<p className={`shopping-cart__carrier-charge-message ${hideForEmail}`}>{t('Carriers charges cannot be calculated at this time and will be adjusted by your sales representative.')}</p>)
}

export function showShippingMethod({name, description, isCES, isEMEA, freightIsTbd}) {
	const shippingMethod = freightIsTbd ? '' : description
	return (isEMEA || isCES) ? `${shippingMethod}` : `${name} ${shippingMethod}`
}
