import { Deal } from '@components'
import PropTypes from 'prop-types'
import React from 'react'
import { noop } from '@lib'

export default function Preview({ emitter, location, purpose }) {
	const { selectedForm } = purpose.getPurpose()

	return (
		<div className='c-preview'>
			<Deal
				onInvalid={noop}
				onSuccess={noop}
				passedFields={selectedForm}
				showSubmit
			/>
		</div>
	)
}

Preview.propTypes = {
	emitter: PropTypes.shape({}),
	location: PropTypes.shape({}),
	purpose: PropTypes.shape({}),
}
