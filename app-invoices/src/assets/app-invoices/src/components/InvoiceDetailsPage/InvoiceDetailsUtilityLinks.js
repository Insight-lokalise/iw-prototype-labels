import React from 'react'
import PropTypes from 'prop-types';
import { t } from '@insight/toolkit-utils/lib/labels'
import Button from '@insight/toolkit-react/lib/Button/Button'

export const InvoiceDetailsUtilityLinks = ({invoiceNumber, opsCenter}) => {
  function handleDownload() {
    const downloadUrl = `${window.location.origin}/insightweb/getInvoicePdfUrlNew/${invoiceNumber}/${opsCenter}`;
    window.location.assign(downloadUrl);
  }
  return (
    <div className="o-grid__item u-1/6@desktop u-1/2@tablet o-grid__item--shrink u-text-right">
      <Button
        className="c-app-invoice-details__links"
        data-testid="download-invoice"
        color="link"
        aria-label={t('Download')}
        icon="download-outline"
        size="small"
        iconPosition="right"
        onClick={handleDownload}
      >
        {t('Download')}{' '}
      </Button>
    </div>
  )
}

InvoiceDetailsUtilityLinks.propTypes = {
  invoiceNumber: PropTypes.number.isRequired,
  opsCenter: PropTypes.number.isRequired
}

export default InvoiceDetailsUtilityLinks
