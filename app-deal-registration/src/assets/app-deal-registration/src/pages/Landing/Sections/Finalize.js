import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@insight/toolkit-react'

export default function Finalize({
	disabled,
	onClick
}) {
	return (
		<div className="c-landing__finalize">
			<Button
				color="primary"
				disabled={disabled}
				onClick={onClick}
			>
				Proceed
			</Button>
		</div>
	)
}
