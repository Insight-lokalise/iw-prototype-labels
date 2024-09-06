import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@insight/toolkit-react'

export default function GroupOptions({
	addInput,
	removeEnabled,
	toggleRemove
}) {
	return (
		<div className="c-builder-fields__options o-grid o-grid--justify-right o-grid--gutters-small">
			<Button color="secondary" onClick={toggleRemove}>
				{removeEnabled ? 'Cancel Removing' : 'Remove Inputs'}
			</Button>
			<Button color="primary" onClick={addInput}>Add Input</Button>
		</div>
	)
}
