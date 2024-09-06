import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import IpsContractsDropdown from '../components/CreateStandards/IpsContractsDropdown'
import { getIpsContracts, selector_ipsContracts, selector_isIps } from '../duck'

function mapStateToProps(state) {
  return {
    isIps: selector_isIps(state),
    options: selector_ipsContracts(state),
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getOptions: () => getIpsContracts(),
    },
    dispatch
  )
}

function IpsContractsDropdownContainer(props) {
  const { getOptions, isIps, ...otherProps } = props

  useEffect(() => {
    if (isIps) {
      getOptions()
    }
  }, [])

  return isIps && <IpsContractsDropdown {...otherProps} />
}

IpsContractsDropdownContainer.propTypes = {
  getOptions: PropTypes.func.isRequired,
  isIps: PropTypes.bool.isRequired,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IpsContractsDropdownContainer)
