import React, { useState, useEffect } from 'react'
import { t } from '@insight/toolkit-utils/lib/labels'
import { useHistory, useParams } from 'react-router-dom'
import { SuggestedAddressModal } from '@insight/toolkit-react'
import AddAddressHeader from './AddAddressHeader'
import AddressForm from '@insight/toolkit-react/lib/AddressForm/AddressForm'
import { getCountryCode } from '../../lib/helpers'
import {
  updateAddress,
  fetchAddresses,
  getStatesByCountry,
  getCountries,
  getAccountInformation,
} from '../../api'
import { goToManage } from './helpers'
import {
  ADDR_CREATE_SUCCESS,
  ADDR_VERIFY_SUCCESS,
  BILLING_ADDRESS,
  creationStatusDescriptionTextMap,
  SAP_SUGESSTED_ADDRESS,
  SHIPPING_ADDRESS,
  USER_ENTERED_ADDRESS,
  SUGGESTED_ADDRESS,
} from './SAPAddressConstants'
import {
  SHIPTO_AVAILABLE_COUNTRY,
  BILLTO_AVAILABLE_COUNTRY,
} from '../../constants'

const EditAddress = ({ addToast }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [suggestedAddressList, setSuggestedAddressList] = useState(false)
  const [enteredAddress, setEnteredAddress] = useState(false)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const history = useHistory()
  const { editType, partner, defaultPartner } = useParams()
  const [currentAddressDisabled, setCurrentAddressDisabled] = useState(false)
  const isEditDefault = partner === defaultPartner
  const countryCode = getCountryCode()

  useEffect(() => {
    const isShipping = editType == '1'

    fetchAddresses({ shipIndicator: isShipping }).then((data) => {
      if (data.shipResponse && data.shipResponse.shipToBillToaddress) {
        const editAddress = data.shipResponse.shipToBillToaddress.find(
          (address) => partner == address.partnerFunction
        )

        const allDisabled = isShipping
          ? !SHIPTO_AVAILABLE_COUNTRY[countryCode].includes(
              editAddress.partnerCountry.trim()
            )
          : !BILLTO_AVAILABLE_COUNTRY[countryCode].includes(
              editAddress.partnerCountry.trim()
            )

        setCurrentAddressDisabled(allDisabled)

        if (editAddress) {
          setEnteredAddress({
            addressType: editType,
            attention: editAddress.attentionLine,
            street1: editAddress.partnerAaddress1,
            street2: editAddress.partnerAddress2,
            city: editAddress.partnerCity,
            zipCode: editAddress.partnerZip,
            companyName: editAddress.partnerCompany,
            country: editAddress.partnerCountry.trim(),
            state: editAddress.partnerState.trim(),
            phoneNum: editAddress.partnerPhone,
            useAsDefaultAddress: isEditDefault,
            allDisabled: allDisabled,
          })
        } else {
          /* stale edit address id will be unlinked and not found because editing address actually creates a new address id in the backend.
          go back to manage page in this scenario. */
          history.push('/userProfile/addresses/manage')
        }
      }
    })
  }, [])

  const editAddressHandler = (address) => {
    updateAddress(address, partner, defaultPartner).then((data) => {
      setIsLoading(false)
      const status = data.creationStatusDescription
      if (status === ADDR_CREATE_SUCCESS || status === ADDR_VERIFY_SUCCESS) {
        addToast({
          message: t('The address was successfully updated'),
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
    delete values.allDisabled
    const address = {
      ...values,
      addressType: editType !== '2' ? SHIPPING_ADDRESS : BILLING_ADDRESS,
    }
    setEnteredAddress(address)
    editAddressHandler(address)
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
      addressType: editType !== '2' ? SHIPPING_ADDRESS : BILLING_ADDRESS,
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
    editAddressHandler(addressToCreate)
  }

  const onClose = () => {
    setModalIsOpen(false)
  }

  return (
    <div className="c-account-center">
      <div className="c-account-header">
        <AddAddressHeader isEdit showMessage={currentAddressDisabled} />
      </div>
      <div className="c-account-center-tiles">
        {enteredAddress && (
          <>
            <AddressForm
              countryCode={countryCode}
              getStatesByCountry={getStatesByCountry}
              getCountries={getCountries}
              isLoading={isLoading}
              onCancel={() => goToManage(history)}
              onSubmit={handleSubmit}
              initialValues={enteredAddress}
              isEditDefault={isEditDefault}
              editType={editType}
              isCreate={false}
              showType={false}
              showSetAsDefault={false}
            />
            {modalIsOpen && (
              <SuggestedAddressModal
                onClose={onClose}
                suggestedAddressList={suggestedAddressList}
                enteredAddress={enteredAddress}
                suggestedModalSubmit={suggestedModalSubmit}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}
export default EditAddress
