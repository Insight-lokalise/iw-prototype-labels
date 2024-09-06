import React, { useState } from 'react'
import { t } from '@insight/toolkit-utils/lib/labels'
import { useHistory } from 'react-router-dom'
import { SuggestedAddressModal } from '@insight/toolkit-react'
import AddressForm from '@insight/toolkit-react/lib/AddressForm/AddressForm'
import AddAddressHeader from './AddAddressHeader'
import { getCountryCode } from '../../lib/helpers'
import { createAddress, getStatesByCountry, getCountries } from '../../api'
import { goToManage } from './helpers'
import {
  ADDR_CREATE_SUCCESS,
  ADDR_VERIFY_SUCCESS,
  BILLING_ADDRESS,
  creationStatusDescriptionTextMap,
  EXISTING_ADDRESS,
  SAP_SUGESSTED_ADDRESS,
  SHIPPING_ADDRESS,
  USER_ENTERED_ADDRESS,
  SUGGESTED_ADDRESS,
} from './SAPAddressConstants'

const AddAddress = ({ addToast }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [suggestedAddressList, setSuggestedAddressList] = useState(false)
  const [enteredAddress, setEnteredAddress] = useState(false)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [addressTypeSelection, setAddressTypeSelection] = useState('1')
  const history = useHistory()

  const addAddressHandler = (address, addressType) => {
    /** on click on create new
     * 1. Trigger submitContactAddress with addressType as 'SHIPPING_ADDRESS' (OR)
     * 2. Trigger submitContactAddress with addressType as 'BILLING_ADDRESS' (OR)
     * */
    createAddress(address).then((data) => {
      setIsLoading(false)
      const status = data.creationStatusDescription
      if (status === ADDR_CREATE_SUCCESS || status === ADDR_VERIFY_SUCCESS) {
        // Disabling both option for now
        // If address type is BOTH then first submitShippingAddress and on success call submitBillingAddress
        // if(addressType === '0'){
        //   setIsLoading(true)
        //   const billingAddress = {
        //     ...address,
        //     addressType: BILLING_ADDRESS,
        //     addressAlreadyVerified: true, // don't need to validate again since already verified when creating Shipping address
        //   }
        //   createAddress(billingAddress).then((billingData)=>{
        //     setIsLoading(false)
        //     const billingStatus = billingData.creationStatusDescription
        //     if (billingStatus === ADDR_CREATE_SUCCESS || billingStatus === ADDR_VERIFY_SUCCESS || billingStatus === EXISTING_ADDRESS) {
        //       addToast({message: t('The address was successfully added'), type:'success'})
        //       history.push('/userProfile/addresses/manage')
        //     }else{
        //       if (status !== SAP_SUGESSTED_ADDRESS && status in creationStatusDescriptionTextMap) {
        //         addToast({message: t(creationStatusDescriptionTextMap[status]), type:'warn'})
        //       }
        //     }
        //   })
        // }else{
        // addToast({message: t('The address was successfully added'), type:'success'})
        // history.push('/userProfile/addresses/manage')
        // }
        addToast({
          message: t('The address was successfully added'),
          type: 'success',
        })
        history.push('/userProfile/addresses/manage')
      } else {
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
          setModalIsOpen(true)
        }
      }
    })
  }

  const handleSubmit = (values) => {
    setIsLoading(true)
    let selectedValue = ''
    if (values.addressType !== '2') {
      selectedValue = SHIPPING_ADDRESS
    } else {
      selectedValue = BILLING_ADDRESS
    }

    const address = {
      ...values,
      addressType: selectedValue,
    }

    setEnteredAddress(address)
    setAddressTypeSelection(values.addressType)
    addAddressHandler(address, values.addressType)
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
      addressType:
        addressTypeSelection !== '2' ? SHIPPING_ADDRESS : BILLING_ADDRESS,
      useAsDefaultAddress: selectedAddress.useAsDefaultAddress,
    }

    if (selectedIndex === USER_ENTERED_ADDRESS) {
      const suggestedAddress = suggestedAddressList[0]
      addressToCreate.suggestedAddress = suggestedAddress
    }
    addressToCreate.userSelectedAddressType =
      selectedIndex == USER_ENTERED_ADDRESS
        ? USER_ENTERED_ADDRESS
        : SUGGESTED_ADDRESS
    addAddressHandler(addressToCreate, addressTypeSelection)
  }

  const onClose = () => {
    setModalIsOpen(false)
  }

  return (
    <div className="c-account-center">
      <div className="c-account-header">
        <AddAddressHeader />
      </div>
      <div className="c-account-center-tiles">
        <AddressForm
          countryCode={getCountryCode()}
          getStatesByCountry={getStatesByCountry}
          getCountries={getCountries}
          isLoading={isLoading}
          onCancel={() => goToManage(history)}
          onSubmit={handleSubmit}
          editType={'1'}
        />
        {modalIsOpen && (
          <SuggestedAddressModal
            onClose={onClose}
            suggestedAddressList={suggestedAddressList}
            enteredAddress={enteredAddress}
            suggestedModalSubmit={suggestedModalSubmit}
          />
        )}
      </div>
    </div>
  )
}
export default AddAddress
