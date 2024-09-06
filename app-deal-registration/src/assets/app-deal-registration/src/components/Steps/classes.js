const numberStatusToClassMap = {
	complete: 'c-step-number--complete',
	danger: 'c-step-number--danger',
	disabled: 'c-step-number--disabled',
	incomplete: 'c-step-number--incomplete',
	warning: 'c-step-number--warning'
}

export const STEP_NUMBER_STATUSES = Object.keys(numberStatusToClassMap)
export const STEP_NUMBER_CLASS_MAP = {
	status: numberStatusToClassMap
}
