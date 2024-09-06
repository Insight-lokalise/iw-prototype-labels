import React from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils/lib/labels'

export default function EmailOrderDetailHeader(props) {
  const { displayDate, isLoggedIn, isSEWP, orderStatus, poValue, salesDocumentNumber, webReferenceNumber } = props
  return (
    <td
      style={{
        margin: '0 auto',
        color: '#3e332d',
        fontFamily: 'allumi-2-std,Helvetica Neue,Helvetica,Helvetica,Arial,sans-serif',
        fontSize: 16,
        fontWeight: 'normal',
        lineHeight: '1.3',
        padding: 0,
        paddingBottom: 16,
        paddingLeft: 16,
        paddingRight: 8,
        textAlign: 'left',
      }}
    >
      <h2>{t('Order details')}</h2>
      <p style={{ color: '#005885' }}>{salesDocumentNumber}</p>
      <strong>{t('Order status')}</strong>
      <p>{orderStatus}</p>
      <table
        style={{
          borderCollapse: 'collapse',
          borderSpacing: 0,
          float: 'left',
          padding: 0,
          textAlign: 'left',
          verticalAlign: 'top',
          width: '100%',
          color: '#3e332d',
          fontFamily: 'allumi-2-std,Helvetica Neue,Helvetica,Helvetica,Arial,sans-serif',
          fontSize: 16,
          fontWeight: 'normal',
          lineHeight: '1.3',
          paddingBottom: 16,
          paddingRight: 8,
        }}
      >
        <tbody>
          <tr>
            <td>
              <strong>{t('Order date')}</strong>
              <p>{displayDate}</p>
            </td>
            <td>
              <strong>{t(`PO / ${isSEWP ? 'STN' : 'PO release'}`)}</strong>
              <p>{poValue}</p>
            </td>
          </tr>
        </tbody>
      </table>
      {isLoggedIn && (
        <span>
          <strong>{t('Reference number')}</strong>
          <p>{webReferenceNumber}</p>
        </span>
      )}
    </td>
  )
}

EmailOrderDetailHeader.propTypes = {
  displayDate: PropTypes.string.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  isSEWP: PropTypes.bool.isRequired,
  orderStatus: PropTypes.string.isRequired,
  poValue: PropTypes.string.isRequired,
  salesDocumentNumber: PropTypes.number.isRequired,
  webReferenceNumber: PropTypes.number.isRequired,
}
