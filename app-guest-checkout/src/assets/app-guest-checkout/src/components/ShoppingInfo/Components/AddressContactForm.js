import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { t } from '@insight/toolkit-utils/lib/labels'
import { Field } from '@insight/toolkit-react'
import Address from '@insight/toolkit-react/lib/Address/Address'
import Lozenge from '@insight/toolkit-react/lib/Lozenge/Lozenge'
import Button from '@insight/toolkit-react/lib/Button/Button'
import Form from '@insight/toolkit-react/lib/Form/Form'
import ButtonGroup from '@insight/toolkit-react/lib/ButtonGroup/ButtonGroup'
import Label from '@insight/toolkit-react/lib/Form/Components/Decorators/Label'
import { validatePhoneNumber } from '@insight/toolkit-utils'

import { selector_shoppingRequest } from '../../../state/slices/selectors/ShoppingReqeustSelector'
import { selector_lineLevelSessionInfos } from '../../../state/slices/selectors/lineLevelSessionInfosSelector'
import { save as saveShoppingRequest } from '../../../state/slices/shoppingRequestSlice'

const AddressContactForm = ({
  isDefaultAddress,
  selectedAddress = {},
  toggleAccordion,
  overrideFields,
  saveAddress,
  onClick,
  addressType
}) => {
  const shoppingRequest = useSelector(selector_shoppingRequest)
  const lineLevelSessionInfos = useSelector(selector_lineLevelSessionInfos)

  const dispatch = useDispatch()

  const initialValues = {
    ...overrideFields,
    selectedAddress: selectedAddress,
  }

   const validateForm = (formData) => {
    const errors = {}
    if (
      formData.phone &&
      !validatePhoneNumber({ phoneNumber: formData.phone })
    ) {
      errors.phone = t('Please enter a valid Phone.')
    }
    return errors
  }
  const submitHandler = async (values) => {
    const isAttentionFormFieldsChanged = overrideAddressSimple(
      values.selectedAddress,//existing address details
      values //current input from form
    )
    if (isAttentionFormFieldsChanged) {
      //update address
      const addressPayload = {
        address: values?.selectedAddress.address,
        companyName: values.companyName,
        phone: values?.phone,
        attentionLine: values?.attentionLine,
      }
      const { data } = await saveAddress(
        shoppingRequest,
        lineLevelSessionInfos,
        JSON.stringify(addressPayload),
        addressType
      )
      dispatch(saveShoppingRequest(data))
    }
    onClick()
  }
  return (
    <Form
      initialValues={initialValues}
      onSubmit={submitHandler}
      validate={(formData) => validateForm(formData)}
      skipValidateOnMount
      validateOnBlur
      render={({ handleSubmit }) => (
        <form
          onSubmit={handleSubmit}
          noValidate
          className="c-form toolkit"
          data-testid="add-new-form"
        >
          <fieldset className="c-form__group">
            <div className="o-grid o-grid--gutters-large">
              <div className="o-grid__item u-1/1 u-1/2@tablet u-margin-bot">
                <Field
                  fieldComponent="Text"
                  name="attentionLine"
                  label={t('Contact name')}
                  type="text"
                  aria-required="true"
                  maxLength={40}
                  data-testid={'attentionLine-input'}
                />
              </div>
              <div className="o-grid__item u-1/1 u-1/2@tablet u-margin-bot">
                <Label id="compnay-label">{t('Company')}</Label>
                <div className="c-readonly">{selectedAddress.companyName}</div>
              </div>
              <div className="o-grid__item u-1/1 u-1/2@tablet u-margin-bot">
                <Field
                  fieldComponent="Text"
                  name="phone"
                  label={t('Phone')}
                  type="tel"
                  minLength={1}
                  maxLength={14}
                  showErrorIcon
                  data-testid={'phone-input'}
                />
              </div>
              <div className="o-grid__item u-1/1 u-1/2@tablet u-margin-bot">
                <label className="c-form__label">{t('Address')}</label>
                <Address
                  address={{
                    attentionLine: selectedAddress?.attentionLine,
                    company: selectedAddress?.companyName,
                    address1: selectedAddress?.address?.address1,
                    address2: selectedAddress?.address?.address2,
                    address3: selectedAddress?.address?.address3 || '',
                    city: selectedAddress?.address?.city,
                    state: selectedAddress?.address?.state,
                    zipcode: selectedAddress?.address?.zipCode,
                    country: selectedAddress?.address?.countryId,
                    phone: selectedAddress?.phone,
                  }}
                />
              </div>
              {isDefaultAddress && (
                <div className="o-grid__item o-grid__item--shrink">
                  <Lozenge color="info">{t('Default')}</Lozenge>
                </div>
              )}
            </div>
          </fieldset>
          <ButtonGroup align="right">
            <Button
              // onClick={onClick}
              data-testid={'continue-button'}
              color="primary"
              type="submit"
            >
              {t('Continue')}
            </Button>
          </ButtonGroup>
        </form>
      )}
    />
  )
}
function overrideAddressSimple(selectedAddress, existingAddressAttention) {
  return (
    selectedAddress.companyName !== existingAddressAttention.companyName ||
    selectedAddress.attentionLine !== existingAddressAttention.attentionLine ||
    selectedAddress.phone !== existingAddressAttention.phone
  )
}
export default AddressContactForm
