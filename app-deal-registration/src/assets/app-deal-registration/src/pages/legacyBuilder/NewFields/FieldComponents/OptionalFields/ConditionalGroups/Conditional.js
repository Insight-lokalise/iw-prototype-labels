import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Button, Icon } from '@insight/toolkit-react'
import { DebouncedInput } from 'components'

const validate = conditional => name => value => {
	if (
		(name === 'when' && conditional.is && !value) ||
		(name === 'is' && conditional.when && !value)
	) {
		return 'Sorry, this field is required'
	}
}

export default function Conditional({
	checkForInputErrors,
	conditional,
	groupIndex,
	itemIndex,
	removeConditional,
	removeEnabled,
	updateConditional
}) {
	const validateFn = validate(conditional)
	const handleRemoveClick = () => {
		removeConditional(itemIndex)
	}

	return (
		<div className="c-builder-field-group__conditional-item">
			<div className="o-grid o-grid--gutters-small">
				<DebouncedInput
					className="o-grid__item"
					fieldComponent="Text"
					handleChange={updateConditional}
					hasError={checkForInputErrors(`conditionalGroups-${groupIndex}-${itemIndex}-when`)}
					label="When"
					name="when"
					validate={validateFn('when')}
					value={conditional.when}
				/>
				<DebouncedInput
					className="o-grid__item"
					fieldComponent="Text"
					handleChange={updateConditional}
					hasError={checkForInputErrors(`conditionalGroups-${groupIndex}-${itemIndex}-is`)}
					label="Is"
					name="is"
					validate={validateFn('is')}
					value={conditional.is}
				/>
				{removeEnabled && (
					<Button className="o-grid__item o-grid__item--shrink c-builder-field-group__conditional-remove" onClick={handleRemoveClick}>
						<Icon type="error" icon="trashcan" />
					</Button>
				)}
			</div>
		</div>
	)
}
