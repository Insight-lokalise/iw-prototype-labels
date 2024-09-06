import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import UniversalGroup from './UniversalGroup'

export default function UniversalGroups({ groups }) {
	return (
		<Fragment>
			{Object.values(groups).map(group => (
				<div className="c-builder-fields__universal-group" key={group.id}>
					<UniversalGroup groupId={group.id} name={group.name} />
				</div>
			))}
		</Fragment>
	)
}
