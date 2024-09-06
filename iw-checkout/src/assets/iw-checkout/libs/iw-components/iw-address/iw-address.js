import React from 'react'
import PropTypes from 'prop-types'

import { normalizeToPurchaseOrderAddress } from './../../models/Address/address'

/**
 * A wrapper for a read-only address section.
 *
 *  @param {Object} props address input (shipping / billing).
 */
export function IWAddress(props) {
    const address = normalizeToPurchaseOrderAddress(props.address)
    const {
        address: {
            address1,
            address2,
            city,
            state,
            zipCode,
            countryId,
        }
    } = address

    return (
        <p id={props.spanId} className={props.className}>
            {!!address1 && address1}<br />
            {!!address2 && <span>{address2}<br /></span>}
            {!!city && city}, {!!state && state} {!!zipCode && zipCode}<br />
            {!!countryId && countryId}
        </p>
    )
}

IWAddress.propTypes = {
    spanId: PropTypes.string,
    address: PropTypes.shape({
        partnerAaddress1: PropTypes.string, // godly typo
        partnerAddress2: PropTypes.string,
        partnerCity: PropTypes.string,
        partnerState: PropTypes.string,
        partnerZip: PropTypes.string,
        partnerCountry: PropTypes.string,

        shippingAddress1: PropTypes.string,
        shippingAddress2: PropTypes.string,
        shippingCity: PropTypes.string,
        shippingState: PropTypes.string,
        shippingZip: PropTypes.string,
        shippingCountry: PropTypes.string,
    })
}
