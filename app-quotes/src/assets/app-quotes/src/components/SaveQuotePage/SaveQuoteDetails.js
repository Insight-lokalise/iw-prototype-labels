import React, { useContext, useEffect } from 'react'
import { Address, Field, Loading, Message, Panel } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'
import Icon from "@insight/toolkit-react/lib/Icon/Icon"

import { SaveQuoteDetailsLinks } from './SaveQuoteDetailsLinks'
import { SaveQuoteContext } from '../../context/SaveQuoteContext'
import { saveShippingAddressToShoppingRequest } from '../../api/saveAddress'

export const SaveQuoteDetails = props => {
  const {
    shipping,
    address,
    attentionLine,
    companyName,
    formValues,
    phone,
    setFormValues,
    addressError,
    setAddressError,
  } = props
  const { availableCarriers, onCarrierUpdate, isLoading } =
    useContext(SaveQuoteContext)

  //const emptyOptions = [{text:"—"}]

  const setFormValueHandler = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    })
  }

  const changeCarrier = async (e) => {
    try {
      setFormValueHandler(e)
      // Get selected carrier from formatted carriers array
      const selectedCarrier = availableCarriers?.find(
        ({ value }) => value === parseInt(e.target.value)
      )
      onCarrierUpdate(selectedCarrier)
    } catch (err) {}
  }

  const fetchSaveAddress = async () => {
    const savedAddr = await saveShippingAddressToShoppingRequest(shipping);
    if (savedAddr?.data?.restrictIntlShipping) {
      setAddressError(true)
    }
  }

  useEffect(()=> {
    fetchSaveAddress()
  },[])

  return (
    <Panel className="c-save-quote-panel c-save-quote-panel-fit">
      {addressError && (
        <div className="c-save-quote-message c-icon--error" >
          <Icon
            aria-hidden="true"
            icon="alert"
            className="c-save-quote__icon"
          />
          <span>
            {t('Shipments out of Canada require a special ordering process.  Please contact your Account Executive for assistance.')}
          </span>
        </div>
      )}
      <div className="c-save-quote-panel__main">
        <div className="o-grid o-grid--justify-between">
          <div className="o-grid__item">
            <h1 className="u-h3 u-text-bold">{t('Save as quote')}</h1>
          </div>
        </div>
        <div className="o-grid o-grid--gutters-small c-save-quote-panel__row">
          <div className="o-grid__item">
            <Field
              fieldComponent="Text"
              name="quoteName"
              label={t('Quote name')}
              maxLength={35}
              onBlur={(e) => setFormValueHandler(e)}
              type="text"
              showErrorIcon
              data-testid={'quote-name-input'}
            />
          </div>
          <div className="o-grid__item">
            <Field
              fieldComponent="Text"
              name="comments"
              label={t('Comments')}
              maxLength={250}
              onBlur={(e) => setFormValueHandler(e)}
              type="text"
              showErrorIcon
              data-testid={'comments-input'}
            />
          </div>
        </div>
        <h5 className="u-1/1 u-text-bold u-h5">{t('Shipping address')}</h5>
        <div className="o-grid o-grid--gutters-small c-save-quote-panel__row">
          <div className="o-grid__item" data-private="true">
            <Field
              fieldComponent="Text"
              name="contactName"
              label={t('Contact name')}
              onBlur={(e) => setFormValueHandler(e)}
              type="text"
              showErrorIcon
              data-testid={'contact-name-input'}
            />
          </div>
          <div className="o-grid__item">
            {availableCarriers?.length ? (
              <Field
                fieldComponent="Select"
                name="shippingMethod"
                label={<>{t('Shipping method')} {isLoading && <Loading size={"medium"} />}</>}
                onChange={(e) => changeCarrier(e)}
                disabled = {isLoading}
                options={availableCarriers}
              />
            ) : null}
          </div>
        </div>
        <div className="o-grid">
          {!address ? (
            <Message type="error">{t('Please select an address')}.</Message>
          ) : (
            <Address
              testid="shipping-address"
              address={{
                ...address,
                attentionLine,
                company: companyName,
                phone,
                zipcode: address?.zipCode,
              }}
            />
          )}
        </div>
      </div>
      <div>
        <SaveQuoteDetailsLinks {...props} />
      </div>
    </Panel>
  )
}

export default SaveQuoteDetails
