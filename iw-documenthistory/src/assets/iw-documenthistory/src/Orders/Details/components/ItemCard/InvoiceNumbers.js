import React from 'react'
import PropTypes from 'prop-types'
import { connectToLocale } from '@insight/toolkit-react'
import { IWAnchor, IWModalLink } from '../../../../libs/iw-components'
import { t } from '@insight/toolkit-utils/lib/labels'

function InvoiceNumbers({ context, numbers, orderNumber, hasInvoicingEnabled }) {
  function handleClick(invoiceNumber) {
    window.location = context.isCES ? 
      `/insightweb/invoices/${invoiceNumber}` :
      `../../invoiceDetails?invNum=${invoiceNumber}&ordNum=${orderNumber}`;
  }

  return (
    <IWModalLink
      linkClassName="orders__link orders__link--inline-block orders__link--margin-bot hide-for-print"
      hideCancelBtn
      hideConfirmBtn
      onConfirm={() => {}}
      linkMarkup={<span className="orders__link-text">{t('Invoice numbers')}</span>}
      modalSize="small"
      modalTitle="Invoice Numbers"
      modalBody={
        <div className="row">
          <div className="columns large-12">
            {numbers.map(number =>
              hasInvoicingEnabled ? 
                <IWAnchor onClick={() => handleClick(number)}>
                    {number}
                </IWAnchor> : 
              number)}
          </div>
        </div>
      }
    />
  )
}

InvoiceNumbers.propTypes = {
  hasInvoicingEnabled: PropTypes.bool.isRequired,
  numbers: PropTypes.arrayOf(PropTypes.string).isRequired,
  orderNumber: PropTypes.number.isRequired,
}

export default connectToLocale(InvoiceNumbers);