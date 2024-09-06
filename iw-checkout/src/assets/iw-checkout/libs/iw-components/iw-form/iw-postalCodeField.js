import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { validateZipcode } from '../../models/Security/validation'
import { selector_countryCode } from '../../Insight/selectors'
import { selector_isAPAC, selector_isEMEA } from '../../User/selectors'
import { IWTextField } from './'
import { validateField } from './validateField'


function IWPostalCodeField(props) {
    function _validatePostalCode(value) {
        const validateZipcodeParams = {
            zipcode: value,
            countryCode: props.countryCode,
            isApac: props.isAPAC,
            isEMEA: props.isEMEA,
            zipCodeLength: props.zipCodeLength,
        }
        return validateField(value, props, { customValidate: validateZipcode, customValidateParams: validateZipcodeParams })
    }

    return (
        <IWTextField validate={_validatePostalCode} {...props} />
    )
}


IWPostalCodeField.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    required: PropTypes.bool,
    readOnly: PropTypes.bool,
    countryCode: PropTypes.string,
    isAPAC: PropTypes.bool,
    zipCodeLength: PropTypes.number,
}

IWPostalCodeField.defaultProps = {
    label: 'ZIP/Postal code',
    name: 'zipPostalCode',
    zipCodeLength: 5,
}


function mapStateToProps(state, ownProps) {
    return {
        countryCode: ownProps.countryCode || selector_countryCode(state),
        isAPAC: selector_isAPAC(state),
        isEMEA: selector_isEMEA(state),
    }
}

export default connect(mapStateToProps)(IWPostalCodeField)
