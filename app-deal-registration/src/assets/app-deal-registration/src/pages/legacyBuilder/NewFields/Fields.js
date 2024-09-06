import React from 'react'
import PropTypes from 'prop-types'

import Custom from './Custom/Custom'
import Universal from './Universal/Universal'

export default function Fields({ emitter, isTemplate }) {
	return (
		<div className="c-builder-fields">
			{!isTemplate && <Universal />}
			<Custom emitter={emitter} />
		</div>
	)
}
