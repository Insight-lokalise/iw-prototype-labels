import React from 'react'
import PropTypes from 'prop-types'
import { Button, Icon } from '@insight/toolkit-react'

export default function DownloadData({ downloadData }) {
	return (
		<div className="c-admin-table__download">
			<h5>Deals</h5>
			<Button className="c-admin-table__download-button" onClick={downloadData}>
				<Icon icon="download" size="small" />
				<span>Download</span>
			</Button>
		</div>
	)
}
