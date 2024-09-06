import { SALES_ORG_TO_ID_MAP, SALES_ORGS } from 'constants'
import { formatCurrencyValue, isNil } from 'lib'
import { ADDRESS_FIELDS, AUTO_POPULATE_SELECTS, MISC_CURRENCY_FIELDS } from '../../constants'
import { transformConditionals, transformFieldOptions, transformValidators } from '../transforms'

const createHandlersMap = handlers => ({
	account: handlers.getAccountData,
	contact: handlers.getContactData,
	email: handlers.handleEmailListChange,
	field: handlers.handleFieldChange,
	rep: handlers.handleRepChange,
	sap: handlers.handleSapAccountChange,
	select: handlers.handleSelect
})

const handleAction = name => type => {
	return (e, error) => {
		return handlersMap[type](e, name, error)
	}
}

let handlersMap = null

export default function universalAdapter(input) {
	const { display, name, type } = input
	return (props, base = {}) => {
		const { errors, groupDisplay, handlers, isEdit, populated, validateAddress, values } = props

		if (type === 'Date') {
			input.validators.push({ type: 'isDateValid' })
		}

		const baseField = transformValidators(input, base, values)
		const field = transformConditionals(input, baseField)
		const path = `${groupDisplay}-${display}`
		const error = errors[path] || ''
		let value = values[path] || ''
		const isSapAccount = values['dealInfo-sapAccount'] === 'Yes'

		if (!handlersMap) {
			handlersMap = createHandlersMap(handlers)
		}

		const actions = handleAction(path)
		if (type === 'Dropdown') {
			field.fullWidth = true
			if (!isEdit) {
				field.hasNoInitialSelection = (display === 'sapAccount' || value) ? false : true
			}
		}

		if (display === 'sapAccount') {
			field.handleChange = actions('sap')
		}

		if (AUTO_POPULATE_SELECTS.includes(display)) {
			if (isSapAccount) {
				field.fieldComponent = 'Dropdown'
				field.handleChange = display === 'contactNumber'
					? actions('contact')
					: actions('select')
			} else {
				field.fieldComponent = 'Text'
				field.handleChange = actions('field')
				if (display === 'contactNumber') {
					field.required = false
				}
			}
		}

		if (MISC_CURRENCY_FIELDS.includes(display)) {
			field.handleBlur = e => {
				e.target.value = formatCurrencyValue(value)
				value = e.target.value
			}
		}

		if (display === 'notificationEmails') {
			field.handleChange = (e, error) => handlersMap['email'](e, 0, error)
		}

		if (display === 'accountNumber') {
			field.onKeyPress = e => {
				if (e.key === 'Enter' || e.key === 'enter') {
					actions('account')(e)
				}
			}
			field.onBlur = e => {
				actions('account')(e)
			}
		}

		if (ADDRESS_FIELDS.includes(input.label)) {
			field.handleChange = (e, error) => {
				validateAddress().then(() => {
					actions('field')(e, error)
				})
			}
		}

		if (display === 'fieldRepInfo') {
			field.handleChange = actions('rep')
		}

		if (!field.handleChange) {
			field.handleChange = actions('field')
		}
		if (!field.fieldComponent) {
			field.fieldComponent = input.type
		}

		if (display === 'contactNumber') {
			field.required = false
		}

		if (display === 'program' || display === 'manufacturer') {
			field.disabled = true
			field.readOnly = true
		}

		if (display === 'accountNumber') {
			field.helpText = 'Please pick an appropriate sales org before pressing enter'
		}

		if (display === 'salesOrg') {
			input.values = SALES_ORGS
		}

		if (AUTO_POPULATE_SELECTS.includes(display)) {
			if (populated[display] && populated[display].length > 0) {
				field.options = populated[display].map(option => ({ text: option }))
			}
			if (isEdit) {
				input.value = value
			}
		} else if (input.values && input.values.length > 0) {
			if (!Array.isArray(input.values)) {
				const splitter = display === 'contactNumber' ? ';' : ','
				input.values = input.values.split(splitter).filter(Boolean)
			}
		}

		const withOptions = AUTO_POPULATE_SELECTS.includes(display)
			? field
			: transformFieldOptions(input, field)

		return {
			...withOptions,
			error,
			label: input.label,
			name,
			value: display === 'notificationEmails' ? value[0] : value
		}
	}
}
