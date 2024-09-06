import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Currency } from '@insight/toolkit-react'
import { selector_permissions } from '../../duck'

function UnitPriceView({ discontinued, value, vatPrice, isEMEA }) {
  return (
    <div className="o-grid__item  u-2/5  u-1/5@tablet  c-cart__cell  c-cart__cell--data-label  c-cart__cell--unit-price" data-label="Unit price">
      { !discontinued ? (
        <Fragment>
          <div><Currency value={value} showVAT={isEMEA} tax={false}/></div>
          { isEMEA && vatPrice != null && <div><Currency value={vatPrice} showVAT={isEMEA} tax={true} highlight={true} /></div> }
        </Fragment>
      ) : (
        <span>-</span>
      )}
    </div>
  )
}

UnitPriceView.propTypes = {
  discontinued: PropTypes.bool.isRequired,
  value: PropTypes.number.isRequired,
  isEMEA: PropTypes.bool.isRequired,
  vatPrice: PropTypes.number,
}

UnitPriceView.defaultProps = {
  vatPrice: null
}

function mapStateToProps(state) {
  const isEMEA = selector_permissions(state).isEMEA || false
  return {
    isEMEA
  }
}

export default connect(mapStateToProps)(UnitPriceView)
