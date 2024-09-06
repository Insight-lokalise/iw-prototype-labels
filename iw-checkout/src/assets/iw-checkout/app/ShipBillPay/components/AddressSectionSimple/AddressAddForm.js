import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { t } from '@insight/toolkit-utils/lib/labels'
import AddressForm from '@insight/toolkit-react/lib/AddressForm/AddressForm'
import SuggestedAddressModal from '@insight/toolkit-react/lib/SuggestedAddressModal/SuggestedAddressModal'
import Field from '@insight/toolkit-react/lib/Form/Field/Field'
import {
  fetchStatesByCountryCode,
  fetchCountries,
} from '../../../../libs/models/Address/address'
import { msgBox } from './../../../../libs/iw-components'
import {
  ADDR_CREATE_SUCCESS,
  ADDR_VERIFY_SUCCESS,
  creationStatusDescriptionTextMap,
  EXISTING_ADDRESS,
  SAP_SUGESSTED_ADDRESS,
  USER_ENTERED_ADDRESS,
  SUGGESTED_ADDRESS,
} from './../../constants/SAPAddressConstants'

const AddressAddForm = (props) => {
  const {
    createAddress,
    countryCode,
    isFirstTimeAddressCreation,
    isSimplifiedCESUser,
    isShipping,
    messageBoxId,
    orderMetaData,
    saveAddress,
    sameAsShippingAddress,
    toggleIsCreatingAddress,
    showDuns
  } = props
  const [disableButtons, setDisableButtons] = useState(false)
  const [suggestedAddressList, setSuggestedAddressList] = useState([])
  const [enteredAddress, setEnteredAddress] = useState({})
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [initialValues, setInitialValues] = useState(null)

  const addAddressHandler = (address) => {
    createAddress(address).then(({ value }) => {
      const status = value.creationStatusDescription
      if (
        status === ADDR_CREATE_SUCCESS ||
        status === ADDR_VERIFY_SUCCESS ||
        status === EXISTING_ADDRESS
      ) {
        saveAddress(
          {
            ...address,
            id: value.partnerFunction,
            favoriteName: value.nickName,
            phone: address.phoneNum,
            overrideAddress: false,
            dunsNumber: address?.dunsNumber
          },
          { updateFavorites: !!value.nickName }
        )
      } else {
        if (
          status !== SAP_SUGESSTED_ADDRESS &&
          status in creationStatusDescriptionTextMap
        ) {
          msgBox.addMsg(messageBoxId, {
            text: t(creationStatusDescriptionTextMap[status]),
            severity: 'error',
            msgId: 'addressFailed',
            scrollTo: '.SBP__section-message',
          })
        }
        setEnteredAddress(address)
        setSuggestedAddressList(value.suggestedAddressesList)
        setAddModalOpen(status === SAP_SUGESSTED_ADDRESS)
      }
      setDisableButtons(false)
    })
  }

  const submitHandler = (values) => {
    setDisableButtons(true)
    const availableUserName = isSimplifiedCESUser
      ? orderMetaData?.userContact?.name
      : values.attention

    const addressToCreate = {
      ...values,
      ...values.attentionForm,
      // when company name is empty, make it the same as Contact name
      companyName: values.companyName ? values.companyName : availableUserName,
      dunsNumber : values.dunsNumber ? values.dunsNumber : '',
      addressAlreadyVerified: false,
      userSelectedAddressType: USER_ENTERED_ADDRESS,
    }

    msgBox.clear(messageBoxId)

    addAddressHandler(addressToCreate)
  }

  const suggestedModalSubmit = (selectedIndex, selectedAddress) => {
    setDisableButtons(true)
    const addressToCreate = {
      ...selectedAddress,
      addressAlreadyVerified: true,
    }
    if(showDuns){
      addressToCreate.dunsNumber = enteredAddress?.dunsNumber ? enteredAddress?.dunsNumber : ''
    }

    if (selectedIndex === USER_ENTERED_ADDRESS) {
      const suggestedAddress = suggestedAddressList[0]
      addressToCreate.suggestedAddress = suggestedAddress
    }
    addressToCreate.userSelectedAddressType =
      selectedIndex == USER_ENTERED_ADDRESS
        ? USER_ENTERED_ADDRESS
        : SUGGESTED_ADDRESS
    addAddressHandler(addressToCreate)
  }

  const setSameAsShippingAddress = () => {
    setInitialValues({
      attention: sameAsShippingAddress.attentionLine,
      companyName: sameAsShippingAddress.companyName,
      street1: sameAsShippingAddress.address.address1,
      street2: sameAsShippingAddress.address.address2,
      city: sameAsShippingAddress.address.city,
      zipCode: sameAsShippingAddress.address.zipCode,
      state: sameAsShippingAddress.address.state,
      phoneNum: sameAsShippingAddress.phone,
    })
  }

  return (
    <div className="toolkit">
      <div className="o-grid o-grid--gutters-large">
        <div className="o-grid__item u-1/1 u-1/2@tablet">
          <p className="u-text-bold">{t('Add new address')}</p>
        </div>
      </div>
      {!isShipping && sameAsShippingAddress && !initialValues && (
        <div className="o-grid o-grid--gutters-large">
          <div className="o-grid__item u-1/1 u-1/2@tablet u-margin-bot-small">
            <Field
              fieldComponent="Checkbox"
              id="sameAsShipping"
              name="sameAsShipping"
              checkboxLabel={t('Same as shipping')}
              onChange={setSameAsShippingAddress}
            />
          </div>
        </div>
      )}
      <AddressForm
        countryCode={countryCode}
        getStatesByCountry={fetchStatesByCountryCode}
        getCountries={fetchCountries}
        isLoading={disableButtons}
        onCancel={() => toggleIsCreatingAddress()}
        onSubmit={submitHandler}
        editType={isShipping ? '1' : '2'}
        initialValues={initialValues}
        showContinueBtn
        showType={false}
        isShipping={isShipping}
        showSetAsDefault={!isSimplifiedCESUser}
        showCancelBtn={!isFirstTimeAddressCreation}
        showDuns={showDuns}
      />
      {addModalOpen && (
        <SuggestedAddressModal
          onClose={() => setAddModalOpen(false)}
          suggestedAddressList={suggestedAddressList}
          enteredAddress={enteredAddress}
          suggestedModalSubmit={suggestedModalSubmit}
        />
      )}
    </div>
  )
}

export default AddressAddForm

AddressAddForm.propTypes = {
  createAddress: PropTypes.func.isRequired,
  saveAddress: PropTypes.func.isRequired,
  messageBoxId: PropTypes.string.isRequired,
  orderMetaData: PropTypes.object,
  sameAsShippingAddress: PropTypes.object,
  isShipping: PropTypes.bool.isRequired,
  toggleIsCreatingAddress: PropTypes.func.isRequired,
  countryCode: PropTypes.string.isRequired,
}
