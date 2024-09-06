import React from 'react'
import { t } from '@insight/toolkit-utils/lib/labels'
import { Currency } from '@insight/toolkit-react'

const ReceiptHeaderItems = ({ title, value, isCurrency, currencyCode }) => {
  return (
    <div className="o-grid__item u-margin-bot o-grid__item--shrink c-reciept-items">
      {!isCurrency ? (
        <>
          <span tabIndex={0} className="u-text-bold">
            {t(title)}
          </span>
          <div tabIndex={0}>{value || '-'}</div>
        </>
      ) : (
        <>
          <span tabIndex={0} className="u-text-bold">
            {t(title)}
          </span>
          <div>
            <Currency currencyCode={currencyCode} value={value} />
          </div>
        </>
      )}
    </div>
  )
}

export default ReceiptHeaderItems
