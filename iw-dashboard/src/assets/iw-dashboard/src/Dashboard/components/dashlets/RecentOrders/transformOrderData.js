import React from 'react'
import cn from 'classnames'
import { Currency } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils/lib/labels'
import Icon from '../../icons/Icon'
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
// { priority: 1, name: 'Number', reference: 'number', className: 'text-center' },
// { priority: 1, name: 'Status', reference: 'status', className: 'text-center' },
// { priority: 5, name: 'Placed By', reference: 'placedBy', className: 'text-center' },
// { priority: 3, name: 'Date', reference: 'createDate', className: 'text-center' },
// { priority: 7, name: 'PO #', reference: 'poNumber', className: 'text-center' },
// { priority: 6, name: 'Reference number', reference: 'referenceNumber', className: 'text-center' },
// { priority: 2, name: 'Total', reference: 'value', className: 'text-center' },
// { priority: 4, name: 'MORE', reference: 'viewDetails', className: 'text-center' },
export default function transformOrderData(recentOrdersData) {
  return (
    recentOrdersData &&
    recentOrdersData.map(order => ({
      rowComponent: IWExpandableTableRow,
      rowComponentProps: createRowComponentProps(order),
    }))
  )
}

function createRowComponentProps(order) {
  const { createDate, currency, number, placedBy, poNumber, referenceNumber, shippable, soldto, status, value } = order
  const hrefURL = `orderDetails/${number}/${soldto}`

  return {
    rowData: {
      number: <IWAnchor href={hrefURL}>{number}</IWAnchor>,
      shippable,
      status: checkStatusName(status, shippable, hrefURL),
      placedBy,
      createDate: <span className="no-wrap">{createDate}</span>,
      poNumber,
      referenceNumber,
      value: value === '' ? '' : <Currency className="no-wrap" value={Number(value)} currencyCode={currency} />,
      viewDetails: <IWAnchor href={hrefURL}>View details</IWAnchor>
    },
  }
}

function checkStatusName(status, shippable, hrefURL) {
    const icon = <Icon type="deliveryTruck" className={cn("c-order-status__truck", checkStatusColor(status, shippable))} />
    const content = (shippable && (status === 'Complete' || status === 'Partially shipped'))
        ? <IWAnchor href={hrefURL}>{icon}</IWAnchor>
        : icon
    return (
        <div className="c-order-status">
            <div className="c-order-status__icon">{content}</div>
            <div className="c-order-status__text">{t(status)}</div>
        </div>
    )
}

function checkStatusColor(status, shippable) {
    if (shippable) {
        if (status === 'Complete') {
            return 'c-order-status--complete'
        } else if (status === 'Partially shipped') {
            return 'c-order-status--partially-shipped'
        }
    }
    return 'c-order-status--placeholder'
}
