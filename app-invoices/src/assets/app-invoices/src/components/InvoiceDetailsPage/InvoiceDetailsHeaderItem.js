import React from 'react'
import { t } from '@insight/toolkit-utils/lib/labels'

export const InvoiceDetailsHeaderItem = ({ testid, title, value }) => (
  <div
    className="o-grid__item u-1/3@desktop u-1/1 u-margin-bot"
    data-testid={testid}
  >
    <span className="u-text-bold">{t(title)}</span>
    <div>{value}</div>
  </div>
)

export default InvoiceDetailsHeaderItem
