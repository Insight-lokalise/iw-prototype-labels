import React from 'react'

const sharedProps = {
	color: 'warning',
	title: <h5>Uh Oh</h5>
}

const createProgramFailure = passedText => ({
	...sharedProps,
	id: 'create-program-failure',
	text: <p>{passedText || `We couldn't create that program`}</p>
})

const fetchManufacturersFailure = passedText => ({
	...sharedProps,
	id: 'fetch-manufacturers-failure',
	text: <p>{passedText || `We couldn't get any manufacturers`}</p>
})

const invalidLandingState = () => ({
	...sharedProps,
	id: 'invalid-landing-state',
	text: <p>Some of these fields are invalid</p>
})

const noDeals = () => ({
	...sharedProps,
	id: 'no-deals',
	text: <p>There is no form associated with that deal</p>
})

const toastMap = {
	'create-program-failure': createProgramFailure,
	'fetch-manufacturers-failure': fetchManufacturersFailure,
	'invalid-landing-state': invalidLandingState,
	'no-deals': noDeals
}

export function createToast(type, additionalArgs) {
	return toastMap[type](additionalArgs)
}
