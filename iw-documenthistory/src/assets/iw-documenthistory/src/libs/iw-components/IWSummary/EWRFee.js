import React from 'react'
import PropTypes from 'prop-types'

import Currency from '@insight/toolkit-react/lib/Currency/Currency'
import { t, getCurrentLocale } from '@insight/toolkit-utils'

import { IWTooltipModal } from '../IWModal'
import SummaryRow from './SummaryRow'

export default function EWRFee({ isCanada, ewrFee, currency }) {
  const ewrText = t('EWR')
  const ewrTitle = t('Electronic waste recycling')
  const locale = getCurrentLocale("insight_current_locale");

  return (
    <SummaryRow
      className="iw-summary__row"
      title={
        <span>
          <abbr title={ewrTitle}>{`${ewrText} `}</abbr>
          <IWTooltipModal
            isCanada={isCanada}
            locale={locale}
          />
        </span>
      }
      priceElement={<Currency value={ewrFee} currencyCode={currency} />}
    />
  )
}

EWRFee.propTypes = {
  currency: PropTypes.string.isRequired,
  ewrFee: PropTypes.number.isRequired,
  isCanada: PropTypes.bool.isRequired,
}
