import React from 'react'
import PropTypes from 'prop-types'
import { DebouncedInput } from 'components'

import GroupFields from './GroupFields'

export default function GroupDisplay({
	emitter,
	group,
	groupError,
	groupId,
	updateGroup,
	validateGroup
}) {
	return (
		<div className="c-builder-fields__group-display">
			<DebouncedInput
				error={groupError}
				fieldComponent="Text"
				handleChange={updateGroup}
				id={`${groupId}-name`}
				label="Group Name"
				name="name"
				required
				value={group.name}
				validate={validateGroup}
			/>
			<GroupFields
				emitter={emitter}
				groupId={groupId}
			/>
		</div>
	)
}
