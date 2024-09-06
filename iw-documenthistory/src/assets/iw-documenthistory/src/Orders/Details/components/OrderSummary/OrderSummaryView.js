import React from 'react'
import PropTypes from 'prop-types'
import { IWSummary } from '../../../../libs/iw-components'

export default function OrderSummaryView(props) {
  const { costProps, currency, isCanada, isEMEA, isXD } = props
  return (
    <IWSummary
      className="orders__container orders__container--summary order__details order__details--ces"
      {...costProps}
      showTax
      isXD={isXD}
      showEWR
      currency={currency}
      isCanada={isCanada}
      isEMEA={isEMEA}
    />
  )
}

OrderSummaryView.propTypes = {
  costProps: PropTypes.shape({
    ewrFee: PropTypes.number,
    gstHstTaxCost: PropTypes.number,
    pstTaxCost: PropTypes.number,
    shippingCost: PropTypes.number,
    subTotal: PropTypes.number,
    taxCost: PropTypes.number,
    totalCost: PropTypes.number,
  }).isRequired,
  currency: PropTypes.string.isRequired,
  isCanada: PropTypes.bool.isRequired,
  carrierOption: PropTypes.string
}
