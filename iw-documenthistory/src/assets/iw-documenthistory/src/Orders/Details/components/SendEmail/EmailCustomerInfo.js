import React from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils/lib/labels'
import { GET_PAYMENT_TYPES, GET_CREDIT_STATUS } from '../../types'

export default function EmailCustomerInfo(props) {
  const {
    accountName,
    billingAddress,
    billingAttn,
    billingCompany,
    blocks,
    creditStatus,
    email,
    isSEWP,
    name,
    paymentType,
    phone,
    poNumber,
    poReleaseNumber,
    shippingAddress,
    shippingAttn,
    shippingCompany,
    soldTo,
  } = props
  const paddingstyle = { padding: '10px 16px 10px 0px' }
  return (
    <td colSpan='2'
      style={{
        color: '#3e332d',
        fontFamily: 'allumi-2-std,Helvetica Neue,Helvetica,Helvetica,Arial,sans-serif',
        fontSize: 16,
        fontWeight: 'normal',
        lineHeight: '1.3',
        padding: '10px 16px 10px 16px',
        textAlign: 'left',
        background: '#fff',
      }}
    >
      <h2>{t('Customer details')}</h2>
      <table
        style={{
          textAlign: 'left',
          color: '#3e332d',
          width: '100%',
          fontFamily: 'allumi-2-std,Helvetica Neue,Helvetica,Helvetica,Arial,sans-serif',
          fontSize: 16,
          fontWeight: 'normal',
          lineHeight: '1.3',
        }}
      >
        <tbody>
          {name && (
            <tr style={paddingstyle}>
              <td>
                <strong>{t('Contact Name')}</strong>
              </td>
              <td>
                <p>{name}</p>
              </td>
            </tr>
          )}
          {email && (
            <tr style={paddingstyle}>
              <td>
                <strong>{t('Contact email')}</strong>
              </td>
              <td>
                <p>{email}</p>
              </td>
            </tr>
          )}
          {phone && (
            <tr style={paddingstyle}>
              <td>
                <strong>{t('Contact phone')}</strong>
              </td>
              <td>
                <p>{phone}</p>
              </td>
            </tr>
          )}
          {soldTo && (
            <tr style={paddingstyle}>
              <td>
                <strong>{t('Account number')}</strong>
              </td>
              <td>
                <p>{soldTo}</p>
              </td>
            </tr>
          )}
          {poNumber && (
            <tr style={paddingstyle}>
              <td>
                <strong>{t('PO number')}</strong>
              </td>
              <td>
                <p>{poNumber}</p>
              </td>
            </tr>
          )}
          {poReleaseNumber && (
            <tr style={paddingstyle}>
              <td>
                <strong>{isSEWP ? t('STN') : t('PO release number')}</strong>
              </td>
              <td>
                {poReleaseNumber ? <p>{poReleaseNumber}</p> : <p style={{ height: '10px' }}>{poReleaseNumber}</p>}
              </td>
            </tr>
          )}
          {GET_PAYMENT_TYPES[paymentType] && (
            <tr style={paddingstyle}>
              <td>
                <strong>{t('Payment type')}</strong>
              </td>
              <td>
                <p>{GET_PAYMENT_TYPES[paymentType]}</p>
              </td>
            </tr>
          )}
          {GET_CREDIT_STATUS[creditStatus] && (
            <tr style={paddingstyle}>
              <td>
                <strong>{t('Credit status')}</strong>
              </td>
              <td>
                <p>{GET_CREDIT_STATUS[creditStatus]}</p>
              </td>
            </tr>
          )}
          {blocks.map((block, index) =>
            block.map(
              item =>
                item.value && (
                  <tr key={item.id} style={paddingstyle}>
                    <td>
                      <strong>{item.name}</strong>
                    </td>
                    <td>
                      <p>{item.value}</p>
                    </td>
                  </tr>
                )
            )
          )}
          <tr>
            <td>
              <span>
                {t('Account:')} {accountName} / {soldTo}
              </span>
            </td>
          </tr>
          <tr>
            <td>
              <strong>{t('Shipped to')}:</strong>
              <p style={{ marginBottom: 10 }}>
                {shippingCompany}
                {shippingAttn && (
                  <span>
                    <br />
                    {t('Attn:')} {shippingAttn}
                  </span>
                )}
                <br />
                {shippingAddress.address1}
                <br />
                {shippingAddress.address2}
                {shippingAddress.address2 && <br />}
                {shippingAddress.address3}
                {shippingAddress.address3 && <br />}
                {shippingAddress.city},{shippingAddress.state}
                {shippingAddress.zipCode}
                <br />
                {shippingAddress.countryId}
              </p>
            </td>
            <td>
              <strong>{t('Billed to')}:</strong>
              <p style={{ marginBottom: 10 }}>
                {billingCompany}
                {billingAttn && (
                  <span>
                    <br />
                    {t('Attn:')} {billingAttn}
                  </span>
                )}
                <br />
                {billingAddress.address1}
                <br />
                {billingAddress.address2}
                {billingAddress.address2 && <br />}
                {billingAddress.address3}
                {billingAddress.address3 && <br />}
                {billingAddress.city},{billingAddress.state}
                {billingAddress.zipCode}
                <br />
                {billingAddress.countryId}
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </td>
  )
}

EmailCustomerInfo.propTypes = {
  accountName: PropTypes.string.isRequired,
  billingAddress: PropTypes.shape({
    // key value pairs
  }).isRequired,
  billingAttn: PropTypes.string.isRequired,
  billingCompany: PropTypes.string.isRequired,
  blocks: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        value: PropTypes.string,
      })
    )
  ).isRequired,
  creditStatus: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  isSEWP: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  paymentType: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  poNumber: PropTypes.string.isRequired,
  poReleaseNumber: PropTypes.string.isRequired,
  shippingAddress: PropTypes.shape({
    // key value pairs
  }).isRequired,
  shippingAttn: PropTypes.string.isRequired,
  shippingCompany: PropTypes.string.isRequired,
  soldTo: PropTypes.number.isRequired,
}
