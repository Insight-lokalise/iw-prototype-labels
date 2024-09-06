import React from 'react'
import { t } from '@insight/toolkit-utils'
import { Address } from '@insight/toolkit-react'

export const SaveQuoteConfirmationHeader = ({
  address = {},
  attentionLine,
  companyName,
  phone,
  shippingMethod,
  comment = '',
}) => {
  const renderComment = () => {
    //truncates comment if over limit
    const characterLimit = 200
    if (!comment) return '-'
    return comment.length >= characterLimit
      ? `${comment.substring(0, characterLimit)}...`
      : comment
  }

  return (
    <div className="o-grid c-save-quote-confirmation__header">
      <div className="o-grid__item u-1/1 u-2/6@tablet">
        <strong>{t('Shipped to')}</strong>
        <Address
          testid="shipping-address"
          address={{
            ...address,
            attentionLine,
            company: companyName,
            zipcode: address.zipCode,
            country: address.country || address.countryId,
            phone,
          }}
        />
      </div>
      <div className="o-grid__item u-1/1 u-2/6@tablet">
        <strong>{t('Shipping method')}</strong>
        <div>{shippingMethod || '-'}</div>
      </div>
      <div className="o-grid__item u-1/1 u-2/6@tablet c-save-quote-confirmation__comments">
        <strong>{t('Comments')}</strong>
        <div>{renderComment()}</div>
      </div>
    </div>
  )
}

export default SaveQuoteConfirmationHeader
