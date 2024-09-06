const FIELD_WHITE_LIST = ['salesOrg', 'quoteNumber', 'sapAccount']
const RESTRICTED_FIELD_DISPLAYS = ['manufacturer', 'program', 'sapAccount', 'notificationEmails']
const SELECTED_FIELD_LIST = ['shipToNumber', 'billToNumber', 'contactNumber']

export default function parseUniversalValues(values, errors, validators) {
	console.log(values)
	const { displayedErrors, passedErrors, ...parsedValues } = Object
		.keys(values)
		.reduce((acc, key) => {
			if (key === 'fileAttachments') {
				acc['fileAttachments'] = values[key]
        return acc
			}

			const [groupDisplay, fieldDisplay] = key.split('-')
			const value = values[key] || ''

			if (!RESTRICTED_FIELD_DISPLAYS.includes(fieldDisplay) && validators[fieldDisplay]) {
				const error = validators[fieldDisplay](value)
				if (fieldDisplay === 'contactNumber' && values['dealInfo-sapAccount'] === 'No') {
					acc.displayedErrors[key] = undefined
				} else {
					acc.displayedErrors[key] = error
					acc.passedErrors.push(error)
				}
			}

			if (groupDisplay === 'dealInfo' && !FIELD_WHITE_LIST.includes(fieldDisplay)) {
				acc[fieldDisplay] = value
				return acc
			}

			if (SELECTED_FIELD_LIST.includes(fieldDisplay)) {
				acc[groupDisplay] = {
					...acc[groupDisplay],
					[fieldDisplay]: value.split(':')[0]
				}
				return acc
			}

			if (fieldDisplay === 'notificationEmails') {
				return {
					...acc,
					[groupDisplay]: {
						...acc[groupDisplay],
						[fieldDisplay]: Object.keys(value).reduce((emails, emailKey) => {
							return [...emails, value[emailKey]]
						}, [])
					}
				}
			}

			acc[groupDisplay] = {
				...acc[groupDisplay],
				[fieldDisplay]: value
			}

			return acc
		}, { displayedErrors: {}, passedErrors: [] })

	console.log(parsedValues)
	const { manufacturer, program, queueStatus = 'NEW', fileAttachments, ...rest } = parsedValues
	const finalValues = {
		manufacturer,
		program,
		queueStatus,
		fileAttachments,
		universal: rest
	}

  return { displayedErrors, finalValues, passedErrors }
}
