import React from 'react'
import { t } from '@insight/toolkit-utils/lib/labels'
import getInObject from '@insight/toolkit-utils/lib/helpers/getInObject'
import AddressForm from '@insight/toolkit-react/lib/AddressForm/AddressForm'

export default function AddressCreateForm({
  isLoading = false,
  onCancel,
  onSubmit,
  initialValues,
  countryCode,
  isFirstTimeAddressCreation,
  getStatesByCountry,
  getCountries,
}) {

  // Flag to determine if user is Guest or CES user or simplified new CES user
  const isLoggedIn = getInObject(window, ['Insight', 'isLoggedin'], false)
  const userInfo = getInObject(window, ['Insight', 'userInformation'], {})
  const isGuestCheckout =
    getInObject(window, ['flags', 'CES-26-GUEST-CHECKOUT']) && !isLoggedIn
  const isCES = isLoggedIn ? userInfo.isCES : false
  const showContinueBtn = isGuestCheckout || isCES

  return (
    <section>
      { !isFirstTimeAddressCreation && (
        <div className="o-grid o-grid--gutters-large">
          <div className="o-grid__item u-1/1 u-1/2@tablet">
            <p className="u-text-bold">{t('Add new address')}</p>
          </div>
        </div>)
      }
      <AddressForm
        countryCode={countryCode}
        getStatesByCountry={getStatesByCountry}
        getCountries={getCountries}
        isLoading={isLoading}
        onCancel={onCancel}
        onSubmit={onSubmit}
        showContinueBtn={showContinueBtn}
        showCancelBtn={!isFirstTimeAddressCreation}
        initialValues={initialValues}
      />
    </section>
  )
}
