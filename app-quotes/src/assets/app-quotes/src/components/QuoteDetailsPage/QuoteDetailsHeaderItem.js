import React from 'react'
import {t} from "@insight/toolkit-utils/lib/labels";

const QuoteDetailsHeaderItem = ({ testid, title, value }) => {
  return (
    <div className="o-grid__item u-1/2@desktop u-1/1 u-margin-bot" data-testid={testid}>
      <span tabIndex={0} className='u-text-bold'>{t(title)}</span>
      <div tabIndex={0}>{value || '-'}</div>
    </div>
  )
}

export default QuoteDetailsHeaderItem
