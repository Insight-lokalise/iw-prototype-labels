import React, { useMemo } from 'react'
import { Field } from 'redux-form'
import PropTypes from 'prop-types'

import GenericFieldContents from './genericFieldContents'
import { validatePhoneNumber } from '../../models/Security/validation'
import { validateField } from './validateField'


export function IWTelephoneField(props) {

	const _validatePhone = useMemo(
		() => (value) => {
			const validateNonAPAC = {
				phoneNumber: value,
				isAPAC: props.isAPAC,
				isEMEA: props.isEMEA,
			}
			return validateField(value, props, { customValidate: validatePhoneNumber, customValidateParams: validateNonAPAC })
		},
		[props.name]
	);

	return (
		<Field
			component={_telephoneFieldContents}
			validate={_validatePhone}
			{...props}
		/>
	)
}


IWTelephoneField.propTypes = {
	label: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	required: PropTypes.bool,
	readOnly: PropTypes.bool,
	isAPAC: PropTypes.bool,
	isEMEA: PropTypes.bool,
}

IWTelephoneField.defaultProps = {
	label: 'Phone',
	name: 'phone',
}


function _telephoneFieldContents(field) {
	return <GenericFieldContents field={field} type='tel' />
}
