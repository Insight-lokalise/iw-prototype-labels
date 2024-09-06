import React from 'react'
import PropTypes from 'prop-types'
import {t} from "@insight/toolkit-utils"

import {Currency} from "@insight/toolkit-react"

export default function Pricing({ showVAT, strike, listPrice, indexPrice }) {
  return (
    <div className="o-grid__item u-1/1">
      <div className="o-grid__item o-grid__item--shrink u-margin-top-tiny u-font-size-tiny">
        <span className="u-margin-bot-small" role="label">
          {
            !!indexPrice ?
            <span>{t('Insight Standard Price:')}</span>
            :<span>{t('List price:')}</span>
          }
        </span>
      </div>
      <div className="o-grid__item o-grid__item--shrink u-margin-top-tiny">
        <Currency
          className="c-pdp__customer-price-strike u-text-bold"
          value={listPrice}
          showVAT={showVAT}
          strike={strike}
          tax={false}
          highlight={true}
        />
      </div>
    </div>

  )
}

Pricing.propTypes = {
  listPrice: PropTypes.number.isRequired,
  showVAT: PropTypes.bool,
  strike: PropTypes.bool,
}

Pricing.defaultProps = {
  showVAT: false,
  strike: false,
}