import React, { Fragment } from 'react'
import { t } from '@insight/toolkit-utils/lib/labels'
import Address from '@insight/toolkit-react/lib/Address/Address'

export const AdditionalDetails = ({ billing, shipping }) => {
  const RenderAddress = ({ details, testid }) => {
    const { address, attentionLine, companyName, phone } = details
    const { address1, address2, address3, city, countryId, name, state, zipCode } = address
    return (
      <Address
        testid={testid}
        address={{
          attentionLine,
          name,
          company: companyName,
          address1,
          address2,
          address3,
          city,
          state,
          zipcode: zipCode,
          country: countryId,
          phone,
        }}
      />
    )
  }
  return (
    <section className="o-grid o-grid--gutters-large c-app-invoices__adddetails">
      <div className="o-grid__item u-1/1 u-1/3@tablet">
        <h5 className="u-margin-bot-small c-app-invoices__adddetails-heading">
          {t('Shipping address')}
        </h5>
        <RenderAddress
          details={shipping}
          headline="Shipping address"
          testid="shipping-address"
        />
      </div>
      {(shipping.carrier || shipping.shippingNotes) &&
        <div className="o-grid__item u-margin-bot u-1/1 u-1/3@tablet">
          <h5 className="u-margin-bot-small c-app-invoices__adddetails-heading">
            {t('Shipping options')}
          </h5>
          {shipping.carrier &&
          <Fragment>
            <span className="u-text-bold">{t('Shipping method')}</span>
            <div className="u-margin-bot">{shipping.carrier.description}</div>
          </Fragment>
          }
          {shipping.shippingNotes && (
            <Fragment>
              <span className="u-text-bold">{t('Shipping related notes')}</span>
              <div>{shipping.shippingNotes}</div>
            </Fragment>
          )}
        </div>
      }
      <div className="o-grid__item u-1/1 u-1/3@tablet">
        <h5 className="u-margin-bot-small c-app-invoices__adddetails-heading">
          {t('Billing address')}
        </h5>
        <RenderAddress
          details={billing}
          headline="Billing address"
          testid="billing-address"
        />
      </div>
    </section>
  )
}

export default AdditionalDetails
