import React from 'react'

export const SaveQuoteConfirmationDetail = ({ title, value, date }) => (
  <div className="o-grid__item">
    <strong>{title}</strong>
    <p className={date ? 'c-save-quote__expires' : ''}>{value || '-'}</p>
  </div>
)

export default SaveQuoteConfirmationDetail
