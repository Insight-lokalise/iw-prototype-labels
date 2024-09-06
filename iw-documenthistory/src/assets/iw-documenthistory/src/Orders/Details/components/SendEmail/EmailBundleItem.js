import React from 'react'
import PropTypes from 'prop-types'

import EmailBundleHeader from './EmailBundleHeader'
import EmailLineItemView from './EmailLineItemView'
import EmailTrackingInfoView from './EmailTrackingInfoView'

export default function EmailBundleItem(props) {
  const {
    currencyFormat,
    currency,
    hasInvoicingEnabled,
    hasTrackingInfo,
    isContract,
    isLoggedIn,
    item,
    lineItemTrackingInfoList,
    getDEPInfo,
  } = props

  return (
    <table
      style={{
        color: '#3e332d',
        fontFamily: 'allumi-2-std,Helvetica Neue,Helvetica,Helvetica,Arial,sans-serif',
        fontSize: 16,
        fontWeight: 'normal',
        lineHeight: '1.3',
        borderCollapse: 'collapse',
        borderSpacing: 0,
        padding: 0,
        verticalAlign: 'top',
        width: '100%',
        paddingTop: 16,
        paddingBottom: 16,
        paddingLeft: 16,
        paddingRight: 8,
        borderTop: '1px solid #e6e6e5',
        borderRight: '1px solid #e6e6e5',
        borderBottom: '1px solid #e6e6e5',
        borderLeft: '1px solid #e6e6e5',
      }}
    >
      <tbody>
        {/* start bundle header */}
        {item.type === 'bundle' && (
          <EmailBundleHeader
            currency={currency}
            item={item}
            prices={getQuantityAndPrice(item.data)}
          />
        )}
        {/* End bundle header */}

        {/* start bundle items */}
        {item.data.map((bundleItem, index) => (
          <EmailLineItemView
            currency={currency}
            currencyFormat={currencyFormat}
            hasInvoicingEnabled={hasInvoicingEnabled}
            index={index}
            isContract={isContract}
            isLoggedIn={isLoggedIn}
            item={bundleItem}
            isBundle={item.type === 'bundle'}
            getDEPInfo={getDEPInfo}
          />
        ))}

        {/* start bundle tracking information */}

        {hasTrackingInfo && (
          <tr>
            <td colSpan="3">
              <table
                style={{
                  MozHyphens: 'auto',
                  WebkitHyphens: 'auto',
                  width: '100%',
                  margin: 0,
                  borderCollapse: 'collapse !important',
                  color: '#3e332d',
                  fontFamily: 'allumi-2-std,Helvetica Neue,Helvetica,Helvetica,Arial,sans-serif',
                  fontSize: 14,
                  fontWeight: 'normal',
                  hyphens: 'auto',
                  lineHeight: '1.3',
                  paddingTop: 12,
                  paddingBottom: 12,
                  paddingLeft: 12,
                  paddingRight: 8,
                  textAlign: 'left',
                  verticalAlign: 'top',
                  wordWrap: 'break-word',
                  background: '#e6e6e5',
                }}
              >
                {lineItemTrackingInfoList.map(lineItem => (
                  <EmailTrackingInfoView key={lineItem.trackingNumber} isLoggedIn={isLoggedIn} lineItem={lineItem} />
                ))}
              </table>
            </td>
          </tr>
        )}

        {/* start bundle tracking information */}
      </tbody>
      {/* end bundle items */}
    </table>
  )
}

function getQuantityAndPrice(item) {
  const total = item.reduce(
    (totals, item) => {
      totals.qtyShippedTotal += item.qtyShipped
      totals.totalPriceSum += item.totalPrice
      return totals
    },
    { qtyShippedTotal: 0, totalPriceSum: 0 }
  )
  return total
}

EmailBundleItem.propTypes = {
  currency: PropTypes.string.isRequired,
  currencyFormat: PropTypes.string.isRequired,
  hasInvoicingEnabled: PropTypes.bool.isRequired,
  hasTrackingInfo: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  item: PropTypes.shape({
    type: PropTypes.string,
    data: PropTypes.shape({
      availableStock: PropTypes.number,
      cartItemMetaData: PropTypes.shape({
        countryOfUsage: PropTypes.string,
        smartTracker: PropTypes.arrayOf(PropTypes.object),
      }),
      contractId: PropTypes.string,
      ewrFee: PropTypes.number,
      lineItemInvoiceInfo: PropTypes.arrayOf(PropTypes.string),
      materialInfo: PropTypes.shape({
        description: PropTypes.string,
        materialId: PropTypes.string,
        unitPrice: PropTypes.number,
        manufacturerPartNumber: PropTypes.string,
        manufacturerName: PropTypes.string,
        nonShipabble: PropTypes.bool,
        programId: PropTypes.string,
        softWareContractId: PropTypes.string,
      }),
      shippingStatus: PropTypes.string,
      totalPrice: PropTypes.number,
    }),
  }).isRequired,
  isContract: PropTypes.bool.isRequired,
  lineItemTrackingInfoList: PropTypes.arrayOf(
    PropTypes.shape({
      // key value pairs
    })
  ),
  getDEPInfo: PropTypes.func.isRequired,
}
