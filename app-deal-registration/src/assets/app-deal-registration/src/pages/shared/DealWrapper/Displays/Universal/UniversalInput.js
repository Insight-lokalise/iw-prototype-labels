import React from 'react'
import { createField } from '../../utils'

import UniversalEmails from './UniversalEmails'

export default function UniversalInput({ input, ...context }) {
	const field = input(context)
	
	return (
		<div className="c-deal-display__input">
			{createField(field, context)}
			{field.name === 'universal-notificationEmails' && (
				<UniversalEmails
					{...context}
					values={context.values['notificationEmails-notificationEmails']}
				/>
			)}
		</div>
	)
}
