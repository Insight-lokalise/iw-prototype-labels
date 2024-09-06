import React from 'react'
import { t } from '@insight/toolkit-utils/lib/labels'
import Address from '@insight/toolkit-react/lib/Address/Address'

export const AdditionalDetails = ({ billing, shipping }) => {
  const RenderAddress = ({ details, testid }) => {
    const { address, attentionLine, companyName, phone } = details
    const { countryId, zipCode } = address
    return (
      <Address
        testid={testid}
        address={{
          ...address,
          attentionLine,
          company: companyName,
          zipcode: zipCode,
          country: countryId,
          phone,
        }}
      />
    )
  }
  const renderShippingOptions = () => (
    <div className="o-grid__item u-margin-bot u-1/1 u-1/3@tablet">
      <h5 className="u-margin-bot-small c-app-quotes__adddetails-heading">
        {t('Shipping options')}
      </h5>
      <span className="u-text-bold">{t('Shipping method')}</span>
      <div className="u-margin-bot">
        {shipping.carrier && shipping.carrier.description ? (
          shipping.carrier.description
        ) : (
          <span>-</span>
        )}
      </div>
      {shipping.shippingNotes ? (
        <React.Fragment>
          <span className="u-text-bold">{t('Shipping related notes')}</span>
          <div> {shipping.shippingNotes}</div>
        </React.Fragment>
      ) : null}
    </div>
  )
  return (
    <section className="o-grid o-grid--gutters-large c-app-quotes__adddetails">
      <div className="o-grid__item u-1/1 u-1/3@tablet">
        <h5 className="u-margin-bot-small c-app-quotes__adddetails-heading">
          {t('Shipping address')}
        </h5>
        {shipping.address && (
          <RenderAddress
            details={shipping}
            headline="Shipping address"
            testid="shipping-address"
          />
        )}
      </div>
      {renderShippingOptions()}
      <div className="o-grid__item u-1/1 u-1/3@tablet">
        <h5 className="u-margin-bot-small c-app-quotes__adddetails-heading">
          {t('Billing address')}
        </h5>
        {billing.address && (
          <RenderAddress
            details={billing}
            headline="Billing address"
            testid="billing-address"
          />
        )}
      </div>
    </section>
  )
}

export default AdditionalDetails
