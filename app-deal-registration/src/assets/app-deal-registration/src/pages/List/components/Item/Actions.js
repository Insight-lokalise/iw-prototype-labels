import React from 'react'
import PropTypes from 'prop-types'
import { Button, Loading } from '@insight/toolkit-react'

export default function Actions({
	handleEdit,
	handlePreview,
	isActive,
	isLoading,
	makeActive
}) {
	return (
		<div className="c-list-item__actions">
			<Button color="primary" onClick={handlePreview}>Preview</Button>
			<Button color="secondary" onClick={handleEdit}>Edit</Button>
			{!isActive && (
				<Button color="secondary" onClick={makeActive}>
					{isLoading ? <Loading size="small" /> : <span>Activate</span>}
				</Button>
			)}
		</div>
	)
}
