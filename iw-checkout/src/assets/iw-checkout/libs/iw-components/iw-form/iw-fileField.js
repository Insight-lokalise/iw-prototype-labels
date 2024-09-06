import React, { useMemo } from 'react'
import { Field } from 'redux-form'
import PropTypes from 'prop-types'

import GenericFieldContents from './genericFieldContents'
import { validateField } from './validateField'


export function IWFileField(props) {
	const _validateText = useMemo(
    () => (value) => (validateField( value, props, { customValidate: props.customValidate })),
    [props.name]
  );

	return (
		<Field
			component={_fileFieldContents}
			validate={_validateText}
			{...props}
		/>
	)
}

IWFileField.propTypes = {
	label: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	required: PropTypes.bool,
	readOnly: PropTypes.bool,
	customValidate: PropTypes.func.isRequired,
}


function _fileFieldContents(field) {
	return <GenericFieldContents field={field} type='file' />
}
