import React, { useMemo } from 'react'
import { Field } from 'redux-form'
import PropTypes from 'prop-types'
import moment from 'moment'

import DatePicker from '@insight/toolkit-react/lib/DatePicker/DatePicker'
import { FieldErrorMessage, FieldLabel } from './formSFCs'
import { validateField } from './validateField'

/**
 * [IWDateField description]
 * @param {[type]} props [description]
 * customValidations in props is array of validators
 * this will be extended to default validation of field
 */
export function IWDateField(props) {
	const _validateDate = useMemo(
    () => (value) => (validateField( value, props, { customType: 'select' })),
    [props.name]
  );
	return (
		<Field
			component={IWDateFieldContents}
			normalize={momentToString}
			validate={_validateDate}
			{...props}
		/>
	)
}


IWDateField.propTypes = {
	label: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	required: PropTypes.bool,
	customValidations: PropTypes.arrayOf(PropTypes.func),
}

IWDateField.defaultProps = {
	label: 'Date',
	name: 'date',
}


function momentToString(dateValue) {
	return (dateValue || dateValue === '') && typeof dateValue === 'string' ?
			dateValue
		:
			moment(dateValue).format('DD-MMM-YYYY')
}


function IWDateFieldContents(props) {
    /* Keep on top */
    const {
        tooltip,
        hideLabel,
        input,
        label,
        meta: { touched, error },
        required,
        showHelpIcon,
        ...rest
    } = props
    /* Keep on top */
    const emptyString = ''
    const showError = touched && !!error
    const dateClassName = `form__field ${showError ? 'form__field--error' : emptyString}`
    return (
        <div>
            <FieldLabel
                tooltip={tooltip}
                hideLabel={hideLabel}
                label={label}
                name={input.name}
                required={required}
                showHelpIcon={showHelpIcon}
            />
            <DatePicker
                isInput
                className={dateClassName}
                {...rest}
                selected={input.value ? moment(input.value, 'DD-MMM-YYYY').toDate() : null}
                {...input}
            />
            <FieldErrorMessage showError={showError} messageText={error} />
        </div>
    )
}
