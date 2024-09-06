import React from 'react'
import { Button, Date } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils/lib/labels'
import { InvoiceDetailsHeaderItem } from './InvoiceDetailsHeaderItem'
import { InvoiceDetailsUtilityLinks } from './InvoiceDetailsUtilityLinks'

export const InvoiceDetailsHeader = ({
  invoiceNumber,
  createdAt,
  PONumber,
  POReleaseNumber,
  accountNumber,
  paymentTerms,
  opsCenter,
  orderNumber,
  salesRepName,
  repPhoneNumber,
  techSupportNumber,
}) => (
  <React.Fragment>
    <div className="o-grid o-grid--justify-between">
      <div className="o-grid__item u-5/6@desktop u-1/2@tablet u-margin-bot">
        <h1 className="u-h3 u-text-bold c-app-invoice-details__heading">
          {t('Invoice details')}
        </h1>
        <div className="o-grid">
          <div className="o-grid__item u-1/4@tablet">
            <h5
              className="c-app-invoice-details__id u-margin-bot-none"
              data-testid="invoiceNum"
            >
              {invoiceNumber}
            </h5>
          </div>
        </div>
      </div>
      <InvoiceDetailsUtilityLinks
        {...{
          invoiceNumber,
          opsCenter,
        }}
      />
    </div>
    <div className="o-grid">
      <InvoiceDetailsHeaderItem
        value={<Date date={createdAt} type="date" />}
        title={'Invoice date'}
        testid="invoice-date"
      />
      <InvoiceDetailsHeaderItem
        value={PONumber}
        title={'PO number'}
        testid="po-number"
      />
      <InvoiceDetailsHeaderItem
        value={POReleaseNumber}
        title={'PO release number'}
        testid="po-release-number"
      />
    </div>
    <div className="o-grid">
      <InvoiceDetailsHeaderItem
        value={accountNumber}
        title={'Account number'}
        testid="account-number"
      />
      <InvoiceDetailsHeaderItem
        value={paymentTerms}
        title={'Payment terms'}
        testid="payment-terms"
      />
    </div>
    <div className="c-app-invoice-details__row" />
    <div className="o-grid">
      <div
        className="o-grid__item u-1/3@desktop u-1/1 u-margin-bot"
        data-testid="order-number"
      >
        <span className="u-text-bold">{t('Order number')}</span>
        <div>
          <Button
            className="c-app-invoice-details__nav"
            color="link"
            href={`/insightweb/orderDetails/${orderNumber}/${accountNumber}`}
          >
            {orderNumber}
          </Button>
        </div>
      </div>
      {salesRepName && (
        <InvoiceDetailsHeaderItem
          value={salesRepName}
          title={'Sales rep'}
          testid="sales-rep"
        />
      )}
      {repPhoneNumber && (
        <InvoiceDetailsHeaderItem
          value={repPhoneNumber}
          title={'Rep phone'}
          testid="rep-phone"
        />
      )}
      {techSupportNumber && (
        <InvoiceDetailsHeaderItem
          value={techSupportNumber}
          title={'Tech support #'}
          testid="tech-support-number"
        />
      )}
    </div>
  </React.Fragment>
)

export default InvoiceDetailsHeader
