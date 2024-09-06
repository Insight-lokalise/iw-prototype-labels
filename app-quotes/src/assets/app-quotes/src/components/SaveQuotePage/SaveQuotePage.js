import React, { useEffect, useState, useContext } from 'react'
import { format, addDays } from 'date-fns'
import { useHistory } from 'react-router-dom'
import {
  Button,
  Summary,
  ResourceItem,
  Form,
  PDPModal,
  Panel,
} from '@insight/toolkit-react'
import { sendSignal } from 'app-api-user-service'
import { l, t } from '@insight/toolkit-utils'
import { SaveQuoteDetails } from './SaveQuoteDetails'
import AddAddress from './AddAddress'
import { SaveQuoteContext } from '../../context/SaveQuoteContext'

export const SaveQuotePage = ({ addToast, locale }) => {
  document.title = t('Save as quote')
  const {
    quote,
    selectedCarrier,
    fetchProductInformation,
    getAccountInformation,
    saveQuote,
    isLoading
  } = useContext(SaveQuoteContext)

  const [savingQuote, setSavingQuote] = useState(false)
  const { cart = {}, soldTo = {}, shipping } = quote
  const [addNewAddress, setAddNewAddress] = useState(false)
  const [quoteAddress, setQuoteAddress] = useState(null)
  const [miniPDPMaterialId, setMiniPDPMaterialId] = useState(false)
  const [isCanada, setIsCanada] = useState(false)
  const [addressError, setAddressError] = useState(false)
  const history = useHistory()

  const [formValues, setFormValues] = useState({
    address: shipping,
    contactName: shipping?.attentionLine || null,
    comments: null,
    shippingMethod: selectedCarrier?.value,
    storedAddress: false,
    quoteName: null,
  })

  useEffect(() => {
    if (shipping) {
      setFormValues({
        ...formValues,
        address: shipping,
        contactName: shipping.attentionLine,
      })
    }
  }, [shipping])

  useEffect(() => {
    if (!selectedCarrier) return
    setFormValues({
      ...formValues,
      shippingMethod: selectedCarrier.value,
    })
  }, [selectedCarrier])

  const openMiniPDP = (materialId) => setMiniPDPMaterialId(materialId)

  const onClose = () => setMiniPDPMaterialId(false)

  const signalRequest = async () => {
    const { cdmUid, salesOrg, sessionId } = await getAccountInformation()
    const signals = cart.cartItems
      .map((cartItem) => {
        if (
          cartItem.cartItemMetaData?.fusionQueryId ||
          cartItem.cartItemMetaData?.signalMetaData
        ) {
          return {
            country: locale.split('_')[1],
            materialId: cartItem.materialInfo.materialId,
            fusionQueryId: cartItem.cartItemMetaData.fusionQueryId,
            signalMetaData: cartItem.cartItemMetaData?.signalMetaData,
            locale,
            salesOrg,
            sku: cartItem.materialInfo.materialId,
            type: 'quote',
            sessionId,
            userId: cdmUid,
          }
        }
      })
      .filter(Boolean)
    sendSignal(signals)
  }

  const handleSubmit = async (form) => {
    const { address } = form
    const shipTo = {
      attentionLine: address.attentionLine,
      favorite: form.storedAddress,
      favouriteId: '0',
      favouriteLineId: '0',
      partnerAaddress1: address.address.address1,
      partnerAddress2: address.address.address2,
      partnerAddress3: address.address.address3,
      partnerCity: address.address.city,
      partnerCompany: address.companyName,
      partnerCountry: address.address.countryId,
      partnerFunction: address.id.toString(),
      partnerName: '',
      partnerState: address.address.state,
      partnerZip: address.address.zipCode,
      partnerPhone: address.phone,
    }
    try {
      setSavingQuote(true)
      const savedQuote = await saveQuote(form, shipTo)
      signalRequest()
      // Navigate to confirmation
      history.push('/quotes/save/confirm', savedQuote)
    } finally {
      setSavingQuote(false)
    }
  }

  const { cartItems = [], summary = {} } = cart
  const {
    ewrFee,
    shippingCost,
    subTotal,
    taxCost,
    totalCost,
    pstTaxCost,
    gstHstTaxCost,
  } = summary

  const ttl = format(addDays(new Date(), 30), 'd-MMM-yyyy')

  const address = quoteAddress ? quoteAddress : shipping

  const checkIsCanadaUser = async () => {
    const userRes = await getAccountInformation()
    const isCanadaUser = userRes?.salesOrg === '4100'
    setIsCanada(isCanadaUser)
  }

  useEffect(() => {
    checkIsCanadaUser()
  }, [])

  const renderItems = () => {
    if (!cartItems?.length) {
      return (
        <p className="c-save-quote__empty">
          {t('No items available for this quote.')}
        </p>
      )
    }
    // Normalize cart items associating enrollment items to parent materials
    const formattedCartItems = cartItems.reduce((cur, item) => {
      const enrollmentParentId = item?.enrollment?.parentId
      if (enrollmentParentId) {
        const parentMaterial = cur[enrollmentParentId]
        // Check if parent contains enrollments
        const enrollments = parentMaterial?.enrollments
          ? [...parentMaterial.enrollments, item]
          : [item]
        // Update parent material with updated enrollments
        cur[enrollmentParentId] = { ...parentMaterial, enrollments }
        return cur
      }
      // Add item to reduced cart object
      return { ...cur, [item.id]: item }
    }, {})

    if (!formattedCartItems) return null
    return Object.values(formattedCartItems)?.map((item = {}, index) => {
      const renderEnrollments = () => {
        if (!item?.enrollments?.length) return null
        return item.enrollments.map((enrollment, index) => (
          <ResourceItem
            key={index}
            isSubItem
            currencyCode={soldTo.currency}
            openMiniPDP={openMiniPDP}
            product={enrollment}
          />
        ))
      }
      return (
        <ResourceItem
          key={index}
          isLastItem={index === cartItems.length - 1}
          currencyCode={soldTo.currency}
          openMiniPDP={openMiniPDP}
          product={{
            ...item,
            imageURL: item.materialInfo?.imageUrl,
          }}
        >
          {renderEnrollments()}
        </ResourceItem>
      )
    })
  }

  return (
    <section className="c-save-quote">   
      {addNewAddress && (
        <AddAddress
          addToast={addToast}
          formValues={formValues}
          handleCancel={() => setAddNewAddress(false)}
          setQuoteAddress={setQuoteAddress}
          setFormValues={setFormValues}
        />
      )}
      {!addNewAddress && (
        <Form
          initialValues={formValues}
          onSubmit={handleSubmit}
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <div className="c-save-quote__top o-grid o-grid--gutters-small">
                <div className="o-grid__item u-1/1 u-3/4@tablet">
                  <SaveQuoteDetails
                    shipping={{
                      ...address,
                      attentionLine: formValues.contactName,
                    }}
                    address={address?.address}
                    addressId={address?.id}
                    attentionLine={formValues.contactName}
                    companyName={address?.companyName}
                    formValues={formValues}
                    phone={address?.phone}
                    setAddNewAddress={setAddNewAddress}
                    setFormValues={setFormValues}
                    setQuoteAddress={setQuoteAddress}
                    addressError={addressError}
                    setAddressError={setAddressError}
                  />
                </div>
                <div className="o-grid__item u-1/1 u-1/4@tablet">
                  <Summary
                    currencyCode={soldTo.currency}
                    subtotal={subTotal}
                    estimatedShipping={shippingCost}
                    estimatedTax={taxCost}
                    ewrFee={ewrFee}
                    total={totalCost}
                    isCanada={isCanada}
                    pstTaxCost={pstTaxCost}
                    gstHstTaxCost={gstHstTaxCost}
                    locale={locale}
                    isInvalid={isLoading}
                  >
                    <div className="c-summary-card-body o-grid">
                      <div className="c-summary-card-body__message">
                        {`${t('*This quote will expire on')} ${ttl}. ${t(
                          'Once the quote expires, pricing will no longer be valid.'
                        )}`}
                      </div>
                      <Button
                        className="c-button--block c-summary-card-body__save"
                        type="submit"
                        color="primary"
                        isDisabled={
                          isLoading || !cartItems?.length || !address || addressError
                        }
                        isLoading={savingQuote}
                      >
                        {t('Save as quote')}
                      </Button>
                    </div>
                  </Summary>
                </div>
              </div>
            </form>
          )}
        />
      )}
      <Panel className="c-save-quote-panel c-save-quote-panel-bottom">
        {renderItems()}
        <PDPModal
          showPDP={miniPDPMaterialId ? true : false}
          showBackOrder={true}
          fetchProduct={() =>
            fetchProductInformation({
              locale: l(),
              materialId: miniPDPMaterialId,
            })
          }
          onClose={onClose}
        />
      </Panel>
    </section>
  )
}
