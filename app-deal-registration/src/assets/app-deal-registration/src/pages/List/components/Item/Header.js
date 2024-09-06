import React from 'react'
import PropTypes from 'prop-types'
import { Status } from 'components'

export default function Header({ id, isActive, versionId }) {
	return (
		<div className="c-list-item__header">
			<p>Version: {versionId}</p>
			<p>Id: {id}</p>
			<Status isActive={isActive} />
		</div>
	)
}
