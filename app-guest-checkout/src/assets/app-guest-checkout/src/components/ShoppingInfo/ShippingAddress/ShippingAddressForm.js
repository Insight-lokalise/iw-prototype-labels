import React from 'react'

import AddressForm from '@insight/toolkit-react/lib/AddressForm/AddressForm'

function ShippingAddressForm({
  isLoading,
  onCancel = () => {},
  onSubmit,
  initialValues,
  countryCode,
  isFirstTimeAddressCreation,
  getStatesByCountry,
  getCountries,
}) {
  return (
    <AddressForm
      countryCode={countryCode}
      getStatesByCountry={getStatesByCountry}
      getCountries={getCountries}
      isLoading={isLoading}
      onCancel={onCancel}
      onSubmit={onSubmit}
      initialValues={initialValues}
      showContinueBtn
      showCancelBtn={!isFirstTimeAddressCreation}
    />
  )
}
export default ShippingAddressForm
