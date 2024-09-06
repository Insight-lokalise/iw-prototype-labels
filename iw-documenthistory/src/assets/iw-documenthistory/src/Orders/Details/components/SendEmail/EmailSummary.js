import React from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils/lib/labels'
import Currency from "@insight/toolkit-react/lib/Currency/Currency";


export default function EmailSummary(props) {
  const { costProps, currency, showEWR, isEMEA, isXD } = props
  const shouldShowEWR = showEWR && costProps.ewrFee > 0
  const paddingstyle = { padding: '10px 16px 10px 0px' }
  const currencyStyle = { color: '#cbc4c3', fontSize: 12 }
  const rightTextStyle = { textAlign: 'right' }
  const leftTextStyle = { textAlign: 'left' }
  return (
    <td
      style={{
        color: '#3e332d',
        fontFamily: 'allumi-2-std,Helvetica Neue,Helvetica,Helvetica,Arial,sans-serif',
        fontSize: 16,
        fontWeight: 'normal',
        lineHeight: '1.3',
        padding: '0 16px 10px 16px',
        textAlign: 'left',
      }}
    >
      <table
        style={{
          borderCollapse: 'collapse',
          borderSpacing: 0,
          float: 'none',
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
          paddingLeft: 16,
          paddingRight: 8,
        }}
      >
        <tbody>
          <tr style={paddingstyle}>
            <td style={leftTextStyle}>{t('Subtotal')}</td>
            <td style={rightTextStyle}>
              <span><Currency className="item-body__value" value={costProps.subTotal} currencyCode={currency} /></span>
            </td>
          </tr>
          <tr style={paddingstyle}>
            <td style={leftTextStyle}>{t('Shipping estimate')}</td>
            <td style={rightTextStyle}>
              <span>
                {isXD ? <span>--</span> : <Currency className="item-body__value" value={costProps.shippingCost} currencyCode={currency} />}
              </span>
            </td>
          </tr>
          {shouldShowEWR && (
            <tr style={paddingstyle}>
              <td style={leftTextStyle}>{t('EWR')}</td>
              <td style={rightTextStyle}>
                <span><Currency className="item-body__value" value={costProps.ewrFee} currencyCode={currency} /></span>
              </td>
            </tr>
          )}
          {costProps.taxCost > -1 && !(costProps.pstTaxCost || costProps.gstHstTaxCost) && (
            <tr style={paddingstyle}>
              <td style={leftTextStyle}>{isEMEA? t('VAT') : t('Tax estimate')}</td>
              <td style={rightTextStyle}>
                <span><Currency className="item-body__value" value={costProps.taxCost} currencyCode={currency} /></span>
              </td>
            </tr>
          )}
          {costProps.pstTaxCost > 0 && (
            <tr style={paddingstyle}>
              <td style={leftTextStyle}>{t('PST / QST estimate')}</td>
              <td style={rightTextStyle}>
                <span style={currencyStyle}>{currency}</span>{' '}
                <span>
                  <Currency className="item-body__value" value={costProps.taxCost} currencyCode={currency} />
                </span>
              </td>
            </tr>
          )}
          {costProps.gstHstTaxCost > 0 && (
            <tr style={paddingstyle}>
              <td style={leftTextStyle}>{t('GST / HST estimate')}</td>
              <td style={rightTextStyle}>
                <span>
                  <Currency className="item-body__value" value={costProps.gstHstTaxCost} currencyCode={currency} />
                </span>
              </td>
            </tr>
          )}
          <tr style={paddingstyle}>
            <td style={leftTextStyle}>{t('Total')}</td>
            <td style={rightTextStyle}>
              <span><Currency className="item-body__value" value={costProps.totalCost} currencyCode={currency} /></span>
            </td>
          </tr>
        </tbody>
      </table>
    </td>
  )
}

EmailSummary.propTypes = {
  costProps: PropTypes.shape({
    ewrFee: PropTypes.number,
    gstHstTaxCost: PropTypes.number,
    pstTaxCost: PropTypes.number,
    shippingCost: PropTypes.number,
    subTotal: PropTypes.number,
    taxCost: PropTypes.number,
  }).isRequired,
  currency: PropTypes.string.isRequired,
  showEWR: PropTypes.bool.isRequired,
  isEMEA: PropTypes.bool.isRequired,
  isXD: PropTypes.bool.isRequired,  
}
