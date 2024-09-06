import React from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils/lib/labels'
import {
    FieldErrorMessage,
    FieldLabel,
} from './formSFCs'


/**
 * [TextAreaFieldContents description]
 * @param {[type]} props [description]
 * customValidations in props is array of validators
 * this will be extended to default validation of field
 */
export default function TextAreaFieldContents(props) {
	/* Keep on top */
	const {
		className,
		tooltip,
		hideLabel,
		input,
		label,
		maxLength,
		meta: { touched, error },
		readOnly,
        regexFormat,
		required,
		showHelpIcon,
	} = props.field
	/* Keep on top */

	const emptyString = ''
	const showError = touched && !!error
	const selectClassName = `form__field form__select ${showError ? 'form__field--error' : emptyString}`

	return (
		<div className={"iw-text-area-field"}>
			<FieldLabel
				className={className}
				hideLabel={hideLabel}
				label={label}
				name={input.name}
				regexFormat={regexFormat}
				required={required}
				showHelpIcon={showHelpIcon}
				tooltip={tooltip}
				>
				<textarea
					className={selectClassName}
					maxLength={maxLength}
					readOnly={readOnly}
					{...input}
					>
				</textarea>
			</FieldLabel>
			{ maxLength &&
				<div className="form__help-text text-right">
					{(maxLength - (input.value.length || 0))} {t('characters remaining')}
				</div>
			}
			<FieldErrorMessage showError={showError} messageText={error}/>
		</div>
	)
}

TextAreaFieldContents.propTypes = {
	field: PropTypes.object.isRequired,
}
