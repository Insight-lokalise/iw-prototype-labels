import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { DebouncedInput as InputField } from 'components'
import { FIELD_TYPE_OPTIONS } from '../../constants'


const validate = value => {
	if (!value) {
		return 'Sorry, this field is required'
	}
}

export default function BasicFields({
	checkForErrors,
	hasNonUniqueId,
	input,
	inputError,
	isDropdown,
	isUniversal,
	updateField
}) {
	const handleChange = ({ target: { name, value }}, error) => {
		updateField(name, value, error)
	}

	return (
		<Fragment>
			<div className="o-grid o-grid--gutters-small">
				<InputField
					className="o-grid__item c-builder-field-group__select"
					fieldComponent="Dropdown"
					handleChange={handleChange}
					hasError={checkForErrors('type')}
					hasNoInitialSelection
					label="Input Type"
					name="type"
					options={FIELD_TYPE_OPTIONS}
					required
					validate={validate}
					value={input.type}
				/>
				<InputField
					className="o-grid__item"
					fieldComponent="Text"
					handleChange={handleChange}
					hasError={checkForErrors('label')}
					label="Input Label"
					name="label"
					required
					validate={validate}
					value={input.label}
				/>
				<InputField
					className="o-grid__item"
					fieldComponent="Text"
					handleChange={handleChange}
					hasError={checkForErrors('name') || hasNonUniqueId}
					helpText="Please enter a unique id for your field"
					label="Input ID"
					name="name"
					required
					validate={validate}
					value={input.name}
				/>
			</div>
			<div className="o-grid o-grid--gutters-small">
				<InputField
					className="o-grid__item"
					fieldComponent="Text"
					handleChange={handleChange}
					hasError={checkForErrors('display')}
					helpText="A fields name is what it should be saved as when it is submitted. e.g. SalesOrg"
					label="Input Name"
					name="display"
					readOnly={!!isUniversal}
					required
					validate={validate}
					value={input.display}
				/>
				{isDropdown && input.type !== 'Checkbox' && (
					<InputField
						className="o-grid__item"
						fieldComponent="Text"
						handleChange={handleChange}
						hasError={checkForErrors('values')}
						helpText="Please enter your input's values separated by a comma"
						label="Field Values"
						name="values"
						validate={validate}
						value={input.values}
					/>
				)}
				{isDropdown && input.type === 'Checkbox' && (
					<InputField
						className="o-grid__item"
						fieldComponent="Text"
						handleChange={handleChange}
						hasError={checkForErrors('values')}
						helpText="Please enter a single value for your checkbox"
						label="Field Value"
						name="values"
						validate={validate}
						value={input.values}
					/>
				)}
			</div>
		</Fragment>
	)
}
