import React from 'react'
import { Currency } from '@insight/toolkit-react'

import { IWAnchor, IWExpandableTableRow } from '../../../../iw-components'

/**
 * transfortms recent invoices API response into recentInvoicesData prop for IWResponsiveTable
 * @param  {array of objects}     recentInvoicesData {
                                              currency,
                                              status,
                                              placedBy,
                                              dueDate,
                                              trackingDataList,
                                              value,
                                              number,
                                              poNumber,
                                              soldto,
                                              invoiceNumber,
                                              referenceNumber,
                                              createDate,
                                            }
 * @return {arrayOfObjects}
 */
export default function transformInvoiceData(recentInvoicesData, isCES) {
  return (
    recentInvoicesData &&
    recentInvoicesData.map(invoice => ({
      rowComponent: IWExpandableTableRow,
      rowComponentProps: createRowComponentProps(invoice, isCES),
    }))
  )
}

function createRowComponentProps(invoice, isCES) {
  const { currency, invoiceNumber, createDate, poNumber, soldto, value, number } = invoice
  const hrefURL = isCES ? `invoices/${invoiceNumber}` : `invoiceDetails?invNum=${invoiceNumber}&ordNum=${number}`
  return {
    rowData: {
      invoiceNumber: <IWAnchor href={hrefURL}>{invoiceNumber}</IWAnchor>,
      createDate: <span className="no-wrap">{createDate}</span>,
      poNumber,
      soldto,
      value: <Currency className="no-wrap" value={Number(value)} currencyCode={currency} />,
    },
  }
}
