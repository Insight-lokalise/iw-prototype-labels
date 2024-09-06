import React, { Fragment, useState, useContext } from 'react'
import { t } from '@insight/toolkit-utils/lib/labels'
import PropTypes from 'prop-types'
import { SuggestedAddressModal } from '@insight/toolkit-react'
import AddressForm from '@insight/toolkit-react/lib/AddressForm/AddressForm'
import { getCountryCode } from '../../lib/helpers'
import { createAddress, getStatesByCountry, getCountries } from '../../api'
import { saveShippingAddressToShoppingRequest } from '../../api/saveAddress'
import { SaveQuoteContext } from '../../context/SaveQuoteContext'
import {
  ADDR_CREATE_SUCCESS,
  ADDR_VERIFY_SUCCESS,
  creationStatusDescriptionTextMap,
  SAP_SUGESSTED_ADDRESS,
  SHIPPING_ADDRESS,
  USER_ENTERED_ADDRESS,
  SUGGESTED_ADDRESS,
} from '../../lib/SAPAddressConstants'

const AddAddress = ({
  addToast,
  formValues,
  handleCancel,
  setQuoteAddress,
  setFormValues,
}) => {
  const { onQuoteUpdate, quote } =
    useContext(SaveQuoteContext)
  const [enteredAddress, setEnteredAddress] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [suggestedModalIsOpen, setSuggestedModalIsOpen] = useState(false)
  const [suggestedAddressList, setSuggestedAddressList] = useState(false)
  const countryCode = getCountryCode()

  const formatAddressForUpdate = ({
    addressData,
    partnerFunction: addressId,
    phoneNumber,
  }) => ({
    address: {
      address1: addressData.street1,
      address2: addressData.street2,
      address3: addressData.street3,
      city: addressData.city,
      state: addressData.region,
      zipCode: addressData.postalCode,
      countryId: addressData.country,
      county: addressData.county,
      company: addressData.companyName,
    },
    attentionLine: addressData.attention,
    companyName: addressData.companyName,
    phone: phoneNumber,
    favoriteName: null,
    notes: '',
    overrideAddress: false,
    id: addressId,
  })

  const addAddressHandler = async (address) => {
    /** on click on create new
     * Trigger submitContactAddress with addressType as 'SHIPPING_ADDRESS'
     * */
    try {
      const data = await createAddress(address)
      setIsLoading(false)
      const status = data.creationStatusDescription
      if (status === ADDR_CREATE_SUCCESS || status === ADDR_VERIFY_SUCCESS) {
        addToast({
          message: t('The address was successfully added'),
          type: 'success',
        })
        afterAddressAdd(data)
        return
      }
      if (
        status !== SAP_SUGESSTED_ADDRESS &&
        status in creationStatusDescriptionTextMap
      ) {
        addToast({
          message: t(creationStatusDescriptionTextMap[status]),
          type: 'warning',
        })
      }
      // Suggested address logic goes here .....
      if (data.suggestedAddressesList.length > 0) {
        setSuggestedAddressList(data.suggestedAddressesList)
        setSuggestedModalIsOpen(true)
      }
    } catch (err) {
      setIsLoading(false)
    }
  }

  async function afterAddressAdd(address) {
    const formattedAddress = formatAddressForUpdate(address)

    const { status } = await saveShippingAddressToShoppingRequest(
      formattedAddress
    )
    if (status !== 200) {
      console.error('Error saving shipping address to shopping request')
      return
    }
    setFormValues({
      ...formValues,
      ...{ contactName: address?.addressData?.attention || null },
    })
    // Set the quote address to the newly entered address.
    setQuoteAddress(formattedAddress)
    onQuoteUpdate(quote)

    handleCancel()
  }

  const handleSubmit = (values) => {
    setIsLoading(true)
    const address = {
      ...values,
      addressType: SHIPPING_ADDRESS,
    }

    setEnteredAddress(address)
    addAddressHandler(address)
  }

  const suggestedModalSubmit = (selectedIndex, selectedAddress) => {
    setIsLoading(true)

    const addressToCreate = {
      addressAlreadyVerified: true,
      attention: selectedAddress.attention,
      city: selectedAddress.city,
      companyName: selectedAddress.companyName,
      country: selectedAddress.country,
      phoneNum: selectedAddress.phoneNum,
      state: selectedAddress.state,
      street1: selectedAddress.street1,
      street2: selectedAddress.street2,
      zipCode: selectedAddress.zipCode,
      addressType: SHIPPING_ADDRESS,
      useAsDefaultAddress: selectedAddress.useAsDefaultAddress,
    }

    if (selectedIndex === USER_ENTERED_ADDRESS) {
      const suggestedAddress = suggestedAddressList[0]
      addressToCreate.suggestedAddress = suggestedAddress
    }
    addressToCreate.userSelectedAddressType =
      selectedIndex === USER_ENTERED_ADDRESS
        ? USER_ENTERED_ADDRESS
        : SUGGESTED_ADDRESS
    addAddressHandler(addressToCreate)
  }

  const onClose = () => {
    setSuggestedModalIsOpen(false)
  }

  return (
    <Fragment>
      <AddressForm
        countryCode={countryCode}
        editType={'1'}
        getStatesByCountry={getStatesByCountry}
        getCountries={getCountries}
        isLoading={isLoading}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        showType={false}
        showSetAsDefault={false}
      />
      {suggestedModalIsOpen && (
        <SuggestedAddressModal
          onClose={onClose}
          suggestedAddressList={suggestedAddressList}
          enteredAddress={enteredAddress}
          suggestedModalSubmit={suggestedModalSubmit}
        />
      )}
    </Fragment>
  )
}

AddAddress.propTypes = {
  addToast: PropTypes.func.isRequired,
  formValues: PropTypes.object,
  handleCancel: PropTypes.func.isRequired,
  setQuoteAddress: PropTypes.func.isRequired,
  setFormValues: PropTypes.func.isRequired,
}

export default AddAddress
