import React, { useEffect, useState } from 'react'
import { format, addDays } from 'date-fns'
import { useLocation } from 'react-router-dom'
import { ResourceItem, Summary, PDPModal, Panel } from '@insight/toolkit-react'
import { t, l } from '@insight/toolkit-utils'
import { SaveQuoteConfirmationDetails } from './SaveQuoteConfirmationDetails'
import { SaveQuoteConfirmationHeader } from './SaveQuoteConfirmationHeader'
import { fetchProductInformation, updateMiniCart } from '../../api'

export const SaveQuoteConfirmationPage = () => {
  document.title = t('Save as quote confirmation')

  const location = useLocation()
  const quote = location.state
  const [miniPDPMaterialId, setMiniPDPMaterialId] = useState(false)
  const userInformation = window.Insight?.userInformation
  const salesOrg = userInformation?.salesOrg
  const isCanada = salesOrg === '4100'

  const openMiniPDP = (materialId) => setMiniPDPMaterialId(materialId)
  const onClose = () => setMiniPDPMaterialId(false)

  useEffect(updateMiniCart, [])

  if (!quote || !quote.cart) {
    return (
      <div className="c-quote-view">
        <h1 className="u-h3 u-text-bold">{t('Error retrieving quote')}</h1>
      </div>
    )
  }

  const { cart, createdOn, soldTo, shipping, orderMetaData } = quote
  const { cartItems = [], summary = {} } = cart
  const { additionalOrderInformation = {} } = orderMetaData
  const {
    ewrFee,
    shippingCost,
    subTotal,
    taxCost,
    totalCost,
    gstHstTaxCost,
    pstTaxCost,
  } = summary

  const ttl = format(addDays(createdOn, 30), 'd-MMM-yyyy')
  const renderItems = () => {
    if (!cartItems?.length) {
      return <p>{t('No items available for this quote.')}</p>
    }
    return cartItems.map((item, index) => (
      <ResourceItem
        key={index}
        isLastItem={index === cartItems.length - 1}
        currencyCode={soldTo.currency}
        openMiniPDP={openMiniPDP}
        product={{ ...item, imageURL: item.materialInfo?.imageUrl }}
      />
    ))
  }
  return (
    <section className="c-save-quote c-save-quote-confirmation">
      <div className="c-save-quote__top o-grid o-grid--gutters-small">
        <div className="o-grid__item u-1/1 u-3/4@tablet">
          <SaveQuoteConfirmationDetails
            {...quote}
            quoteName={additionalOrderInformation.quoteName}
            createdAt={format(createdOn, 'd-MMM-yyyy')}
            expires={ttl}
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
          >
            <div className="c-summary-card-body">
              <div className="c-summary-card-body__message">
                {`${t('*This quote will expire on')} ${ttl}. ${t(
                  'Once the quote expires, pricing will no longer be valid.'
                )}`}
              </div>
            </div>
          </Summary>
        </div>
      </div>
      <Panel className="c-save-quote-panel c-save-quote-panel-bottom">
        <SaveQuoteConfirmationHeader
          companyName={shipping?.companyName}
          address={shipping?.address}
          attentionLine={shipping?.attentionLine}
          phone={shipping?.phone}
          shippingMethod={shipping?.carrier?.description}
          comment={additionalOrderInformation.quoteNotes}
        />
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

export default SaveQuoteConfirmationPage
