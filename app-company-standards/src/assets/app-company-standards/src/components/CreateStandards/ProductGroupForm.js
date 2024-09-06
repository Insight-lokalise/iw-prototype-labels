import React from 'react'
import PropTypes from 'prop-types'

import IpsContractsDropdownContainer from '../../containers/IpsContractsDropdownContainer'
import ConfigSkuDropdownContainer from '../../containers/ConfigSkuDropdownContainer'

export function productGroupFormReducer(state, { payload, type }) {
  switch (type) {
    case 'SET_CONFIG_TYPE':
      return { ...state, labConfigType: payload }
    case 'SET_IPS_CONTRACT':
      return { ...state, ipsContractId: payload }
    case 'RESET':
      return payload
    default:
      return state
  }
}

export default function ProductGroupForm({ disabled, dispatch, state }) {
  return (
    <div className="o-grid o-grid--gutters u-margin-bot">
      <div className="o-grid__item u-1/1 u-1/2@tablet">
        <ConfigSkuDropdownContainer
          disabled={disabled}
          onChange={e => dispatch({ type: 'SET_CONFIG_TYPE', payload: e.target.value })}
          value={state.labConfigType}
        />
      </div>
      <div className="o-grid__item u-1/1 u-1/2@tablet">
        <IpsContractsDropdownContainer
          disabled={disabled}
          onChange={e => {
            dispatch({ type: 'SET_IPS_CONTRACT', payload: e.target.value })
          }}
          value={state.ipsContractId}
        />
      </div>
    </div>
  )
}

ProductGroupForm.propTypes = {
  disabled: PropTypes.bool,
  dispatch: PropTypes.func.isRequired,
  state: PropTypes.shape({
    ipsContractId: PropTypes.string,
    labConfigType: PropTypes.string.isRequired,
  }).isRequired,
}

ProductGroupForm.defaultProps = { disabled: false }