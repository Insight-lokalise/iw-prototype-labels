import React from 'react'
import { Currency } from '@insight/toolkit-react'

import { IWAnchor, IWExpandableTableRow } from '../../../../iw-components'

/**
 * transfortms recent quotes API response into tableData prop for IWResponsiveTable
 * @param  {array of objects}     tableData {
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
export default function transformQuoteData(recentQuotesData, isCES) {
  return (
    recentQuotesData &&
    recentQuotesData.map(quote => ({
      rowComponent: IWExpandableTableRow,
      rowComponentProps: createRowComponentProps(quote, isCES),
    }))
  )
}

function createRowComponentProps(quote, isCES) {
  const { currency, quoteName, number, referenceNumber, placedBy, createDate, value, soldto } = quote
  const hrefURL = isCES ? `quotes/details/${number}` : `quoteDetails?quoNum=${number}&documentSoltos=${soldto}`
  return {
    rowData: {
      number: <IWAnchor href={hrefURL}>{number}</IWAnchor>,
      quoteName,
      referenceNumber,
      placedBy,
      createDate: <span className="no-wrap">{createDate}</span>,
      value: value === '' ? '' : <Currency className="no-wrap" value={Number(value)} currencyCode={currency} />,
    },
  }
}
