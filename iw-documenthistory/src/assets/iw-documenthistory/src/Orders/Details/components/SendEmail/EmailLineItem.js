import React from 'react'
import PropTypes from 'prop-types'

import EmailLineItemView from './EmailLineItemView'
import EmailTrackingInfoView from './EmailTrackingInfoView'
import { getBundleTrackingInfo } from '../ItemCard/ItemTracking/helpers/itemTracking'

export default function EmailLineItem(props) {
  const { data, type } = props.item
  const itemDataProps = (type === 'bundle' && getBundleTrackingInfo(props.item)) || (type === 'item' && data) || {}
  const {
    currencyFormat,
    currency,
    hasInvoicingEnabled,
    hasTrackingInfo,
    isContract,
    isLoggedIn,
    lineItemTrackingInfoList,
    getDEPInfo,
  } = props

  return (
    <tbody>
      {type === 'item' && (
        <EmailLineItemView
          currencyFormat={currencyFormat}
          hasInvoicingEnabled={hasInvoicingEnabled}
          item={data}
          isContract={isContract}
          isLoggedIn={isLoggedIn}
          currency={currency}
          getDEPInfo={getDEPInfo}
        />
      )}

      {/* start item tracking information */}
      {type === 'item' &&
        hasTrackingInfo &&
        !itemDataProps.materialInfo.nonShipabble && (
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
                  paddingTop: 16,
                  paddingBottom: 16,
                  paddingLeft: 16,
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
      {/* End item tracking information */}
    </tbody>
  )
}

EmailLineItem.propTypes = {
  currency: PropTypes.string.isRequired,
  currencyFormat: PropTypes.string.isRequired,
  hasInvoicingEnabled: PropTypes.bool.isRequired,
  hasTrackingInfo: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  item: PropTypes.shape({
    type: PropTypes.string,
    data: PropTypes.shape({
      // key value pairs
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
