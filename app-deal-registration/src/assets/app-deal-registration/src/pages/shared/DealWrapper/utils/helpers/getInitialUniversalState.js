import { applyAdapter } from '../adapters'
import { SALES_ID_TO_ORG_MAP } from '@constants'

const getDefaultForDisplay = display => {
	if (display === 'sapAccount') {
		return 'Yes'
	}
	if (display === 'fieldRepInfo') {
		return 'No'
	}
	return display === 'notificationEmails' ? [] : ''
}

const getInitialData = ({ groups, inputs }, formFields, isEdit) => {
	const formData = (formFields && formFields.formFields.universal) || false

	return Object.keys(groups).reduce(
		(acc, groupKey) => {
			const group = groups[groupKey]
			acc.groups.push(group)
			const { display: groupDisplay } = group

			for (const inputKey of Object.keys(inputs)) {
				const input = inputs[inputKey]
				const { display } = input

				if (inputKey.split('-')[0] === group.id) {
					const path = `${groupDisplay}-${display}`
					const defaultValue = getDefaultForDisplay(display)
					if (
						display !== 'manufacturer' ||
						display !== 'program' ||
						display !== 'salesOrg'
					) {
						acc.values[path] =
							(formData &&
								formData[groupDisplay] &&
								formData[groupDisplay][display]) ||
							defaultValue
					}
					acc.fields[groupKey] = [
						...(acc.fields[groupKey] || []),
						applyAdapter(input, 'universal'),
					]
				}
			}

			return acc
		},
		{ fields: {}, groups: [], values: {} }
	)
}

const getBaseInitialValues = ({
	formData,
	manufacturer,
	program,
	purpose,
	salesAreaId,
}) => {
	return {
		'dealInfo-manufacturer':
			manufacturer ||
			(purpose.selectedManufacturer &&
				purpose.selectedManufacturer.manufacturer) ||
			'',
		'dealInfo-program': program || purpose.selectedProgram || '',
		'dealInfo-salesOrg': SALES_ID_TO_ORG_MAP[salesAreaId],
		fileAttachments:
			(formData && formData.formFields && formData.formFields.fileAttachments) ||
			[],
	}
}

const baseState = {
	errors: {},
	isSapAccount: true,
	lastGroupUpdated: '',
	populated: {
		billToNumber: '',
		contactNumber: '',
		shipToNumber: '',
	},
}

export default function getInitialUniversalState(props) {
	const { fields: passedFields, formData, isEdit } = props
	const baseValues = getBaseInitialValues(props)
	const { fields, groups, values } = getInitialData(
		passedFields,
		formData,
		isEdit
	)
	return {
		fields,
		groups,
		state: {
			...baseState,
			values: { ...values, ...baseValues },
		},
	}
}
