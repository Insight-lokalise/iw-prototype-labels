export const COUNTRY_OPTIONS = [{
	value: {
		active: true,
		countryCode: 'US',
		salesAreaId: 1,
		salesOrg: 2400,
		display: 2400
	},
	text: 2400
}]

export const INITIAL_LANDING_STATE = {
	displayAll: false,
	errors: {},
	isFetching: false,
	manufacturers: [],
	values: {
		country: undefined,
		manufacturer: undefined,
		program: undefined,
		purpose: undefined
	}
}

export const PURPOSE_OPTIONS = [{
	id: 'submission',
	label: 'Deal submission',
	value: 'submission'
}, {
	id: 'forms',
	label: 'Create/Edit forms',
	value: 'forms'	
}, {
	id: 'templates',
	label: 'Create/Edit templates',
	value: 'templates'
}]
