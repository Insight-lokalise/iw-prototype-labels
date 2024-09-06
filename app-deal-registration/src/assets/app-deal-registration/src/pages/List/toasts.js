import React from 'react'

const activateFormFailure = passedText => ({
	color: 'error',
	id: 'activate-form-failure',
	text: <p>{passedText || `We couldn't activate that form`}</p>
})

const activateFormSuccess = () => ({
	color: 'success',
	id: 'activate-form-success',
	text: <p>Your form was successfully activated!</p>
})

const toastMap = {
	'activate-form-failure': activateFormFailure,
	'activate-form-success': activateFormSuccess
}

export function createToast(type, additionalArgs) {
	return toastMap[type](additionalArgs)
}
