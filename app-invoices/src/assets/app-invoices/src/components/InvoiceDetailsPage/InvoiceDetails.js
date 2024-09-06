import React, { Fragment } from 'react'
import {Address, Panel, Summary} from "@insight/toolkit-react";
import { t, getCurrentLocale } from '@insight/toolkit-utils'
import {InvoiceDetailsHeader} from "./InvoiceDetailsHeader";
import {InvoiceDetailsItems} from "./InvoiceDetailItems";

export const InvoiceDetails= ({ isCanada, header , shoppingRequest }) => {
  const {
    invoiceNumber,
    createdOn,
    po,
    poRelease,
    terms,
    opsCenter,
    orderNumber,
    repName,
    repPhone,
    remitAddress,
    techSupportNumber,
  } = header
  const { cart = {}, soldTo = {} } = shoppingRequest
  const locale = getCurrentLocale('insight_current_locale')

  return(
    <Fragment>
      <div className="o-grid o-grid--justify-between">
        <div className="o-grid__item u-3/4@desktop u-3/5@tablet u-1/1 c-app-invoice-details__header">
          <Panel className="c-app-invoice-details__card">
            <Panel.Body>
              <InvoiceDetailsHeader
                invoiceNumber={invoiceNumber}
                createdAt={createdOn}
                PONumber={po}
                POReleaseNumber={poRelease}
                accountNumber={soldTo.id}
                paymentTerms={terms}
                opsCenter={opsCenter}
                orderNumber={orderNumber}
                salesRepName={repName}
                repPhoneNumber={repPhone}
                techSupportNumber={techSupportNumber}
              />
            </Panel.Body>
          </Panel>
        </div>
        <div className="o-grid__item u-1/4@desktop u-2/5@tablet u-1/1">
          <Summary
            currencyCode={soldTo.currency}
            subtotal={cart.summary.subTotal}
            estimatedShipping={cart.summary.shippingCost}
            estimatedTax={cart.summary.taxCost}
            ewrFee={cart.summary.ewrFee}
            total={cart.summary.totalCost}
            isCanada={isCanada}
            pstTaxCost={cart.summary.pstTaxCost}
            gstHstTaxCost={cart.summary.gstHstTaxCost}
            locale={locale}
          >
            {remitAddress &&
            <div className="c-summary-card-body">
              <div className="c-app-invoice-details__remit-title u-text-bold">
                {t('Remit Payment to:')}
              </div>
              <Address
                address={{
                  company: remitAddress.companyName,
                  address1: remitAddress.address1,
                  city: remitAddress.city,
                  state: remitAddress.state,
                  zipcode: `${remitAddress.zipCode}-${remitAddress.zipExt}`,
                  country: remitAddress.country,
                }}
              />
            </div>
            }
          </Summary>
        </div>
      </div>
      <Panel className="c-app-invoice-details__bottom">
        <Panel.Body>
          <InvoiceDetailsItems shoppingRequest={shoppingRequest} />
        </Panel.Body>
      </Panel>
    </Fragment>
  )
}

export default InvoiceDetails
