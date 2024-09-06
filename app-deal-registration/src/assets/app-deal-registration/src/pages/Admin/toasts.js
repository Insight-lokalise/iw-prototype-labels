import React from 'react'

const fetchManufacturerFailure = passedText => ({
	color: 'error',
	id: 'fetch-manufacturer-failure',
	text: <p>{passedText || `We couldn't get any manufacturers`}</p>
})

const invalidSearchState = () => ({
	color: 'error',
	id: 'invalid-search-state',
	text: <p>Please check your fields for errors</p>
})

const updatePreviewFailure = passedText => ({
	color: 'error',
	id: 'update-preview-failure',
	text: <p>{passedText || `We could not update these fields`}</p>
})

const updatePreviewSuccess = () => ({
	color: 'success',
	id: 'update-preview-success',
	text: <p>This Deal has been updated</p>
})

const toastMap = {
	'fetch-manufacturer-failure': fetchManufacturerFailure,
	'invalid-search-state': invalidSearchState,
	'update-preview-failure': updatePreviewFailure,
	'update-preview-success': updatePreviewSuccess
}

export function createToast(type, additionalArgs) {
	return toastMap[type](additionalArgs)
}
