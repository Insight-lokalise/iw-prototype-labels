import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@insight/toolkit-react'
import { DebouncedInput } from 'components'
import { generateValidatorsForFieldType } from 'pages/Builder/helpers'

const shouldShowNormalValue = ({ type }) => {
	return type && type !== 'conditionalRequired' && type !== 'required' && type !== 'email'
}

const shouldShowConditional = ({ type }) => type === 'conditionalRequired'

const validate = validator => name  => value => {
	if (
		(name === 'when' && validator.is && !value) ||
		(name === 'is' && validator.when && !value) ||
		(name === 'value' && validator.type && !value) ||
		(name === 'type' && !value)
	) {
		return 'Sorry, this field is required'
	}
}

export default function Validator({
	checkForInputErrors,
	inputType,
	itemIndex,
	removeEnabled,
	removeValidator,
	updateValidator,
	validator
}) {
	const handleRemove = () => {
		removeValidator(itemIndex)
	}
	const validateFn = validate(validator)
	const updateFn = (e, error) => {
		updateValidator(itemIndex, e, error, `validators-${itemIndex}-${e.target.name}`)
	} 
	const validatorOptions = generateValidatorsForFieldType(inputType)

	return (
		<div className="c-builder-field-group__validator">
			{removeEnabled && (
				<Button 
					className="c-builder-field-group__remove"
					icon="close" 
					onClick={handleRemove} />
			)}
			<div className="o-grid o-grid--gutters-small">
				<DebouncedInput
					className="o-grid__item c-builder-field-group__select"
					fieldComponent="Dropdown"
					handleChange={updateFn}
					hasError={checkForInputErrors(`validators-${itemIndex}-type`)}
					hasNoInitialSelection
					label="Choose the type of validator"
					name="type"
					options={validatorOptions}
					validate={validateFn('type')}
					value={validator.type}
				/>
				{shouldShowNormalValue(validator) && (
					<DebouncedInput
						className="o-grid__item"
						fieldComponent="Text"
						handleChange={updateFn}
						hasError={checkForInputErrors(`validators-${itemIndex}-value`)}
						label="What is the rule for this type"
						name="value"
						validate={validateFn('value')}
						value={validator.value}
					/>
				)}
				{shouldShowConditional(validator) && (
					<div className="o-grid__item u-2/3">
						<div className="o-grid o-grid--gutters-small">
							<DebouncedInput
								className="o-grid__item"
								fieldComponent="Text"
								handleChange={updateFn}
								hasError={checkForInputErrors(`validators-${itemIndex}-when`)}
								label="When"
								name="when"
								validate={validateFn('when')}
								value={validator.when}
							/>
							<DebouncedInput
								className="o-grid__item"
								fieldComponent="Text"
								handleChange={updateFn}
								hasError={checkForInputErrors(`validators-${itemIndex}-is`)}
								label="Is"
								name="is"
								validate={validateFn('is')}
								value={validator.is}
							/>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
