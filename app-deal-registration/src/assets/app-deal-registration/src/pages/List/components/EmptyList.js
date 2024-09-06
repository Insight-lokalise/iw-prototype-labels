import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@insight/toolkit-react'

export default function EmptyList({ goToBuilder }) {
	return (
		<div className="c-list__empty">
			<p>There are no items here</p>
			<Button color="primary" onClick={goToBuilder}>
				Go create some
			</Button>
		</div>
	)
}
