import React from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils/lib/labels'
import Currency from "@insight/toolkit-react/lib/Currency/Currency";

export default function EmailBundleHeader(props) {
  const { currency, item, prices } = props
  return (
    <tr style={{ backgroundColor: '#e6e6e5', textAlign: 'left' }}>
      <td colSpan="2" style={{ textAlign: 'left', padding: '10px 16px 10px 16px' }}>
        <table
          style={{
            textAlign: 'left',
            color: '#3e332d',
            fontFamily: 'allumi-2-std,Helvetica Neue,Helvetica,Helvetica,Arial,sans-serif',
            fontSize: 14,
          }}
        >
          <tr>
            <td colSpan="2">
              <span>
                {t('Mfr Part #')}: <strong>{item.data[0].bundle.name}</strong>
              </span>
              <br />
              <span>{item.status}</span>
            </td>
          </tr>
          <tr>
            <td style={{ width: '200px' }}>{t('Qty')}</td>
            <td>{item.data[0].bundle.quantity}</td>
          </tr>
          <tr>
            <td style={{ width: '200px' }}>{t('Total price')}</td>
            <td>
              <span style={{ color: '#cbc4c3', fontSize: 16 }}>{currency}</span>{' '}
              <span style={{ fontWeight: 'bold' }}>
                <Currency className="item-body__value" value={prices.totalPriceSum} currencyCode={currency} />
              </span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  )
}

EmailBundleHeader.propTypes = {
  currency: PropTypes.string.isRequired,
  item: PropTypes.shape({
    data: PropTypes.arrayOf(
      PropTypes.shape({
        bundle: PropTypes.shape({
          name: PropTypes.string,
          quantity: PropTypes.number.isRequired,
        }),
      })
    ),
  }).isRequired,
  prices: PropTypes.shape({
    qtyShippedTotal: PropTypes.number,
    totalPriceSum: PropTypes.number,
  }).isRequired,
}
