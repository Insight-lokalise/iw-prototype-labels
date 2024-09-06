import PropTypes from 'prop-types'
import React from 'react'

/**
 * A wrapper for a read-only address section.
 */
export function IWAddress({ address, className }) {
  const { address1, address2, city, state, zipCode, countryId } = address

  return (
    <p className={className}>
      {!!address1 && address1}
      <br />
      {!!address2 && (
        <span>
          {address2}
          <br />
        </span>
      )}
      {!!city && `${city}, `}
      {!!state && state} {!!zipCode && zipCode}
      <br />
      {!!countryId && countryId}
    </p>
  )
}

IWAddress.propTypes = {
  address: PropTypes.shape({
    address1: PropTypes.string,
    address2: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    zipCode: PropTypes.string,
    countryId: PropTypes.string,
  }),
}
