import React from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils/lib/labels'

export default function PrintInvoiceNumbers({ numbers }) {
  return (
    <div className="show-for-print print-invoice-numbers">
      <div className="row expanded">
        <div className="columns small-6">
          <h4 className="print-invoice-numbers__heading item-body__label">{t('Invoice Numbers')}</h4>
        </div>
        <div className="columns small-6">
          {numbers.map(number => (
            <span className="item-body__value" key={number}>
              {number}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

PrintInvoiceNumbers.propTypes = {
  numbers: PropTypes.arrayOf(PropTypes.string).isRequired,
}
