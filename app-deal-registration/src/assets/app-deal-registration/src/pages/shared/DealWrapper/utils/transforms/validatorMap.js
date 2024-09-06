import { isAfter, isBefore } from 'date-fns'
import { dateFieldsFormatted } from 'lib'

const emailExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const validatorMap = {
	beforeDay: maxDate => value => ({
		message: 'Sorry, that date is too late',
		validator: isBefore(new Date(maxDate), new Date(value))
	}),
	afterDay: oldestDate => value => ({
		message: 'Sorry, the date you choose is too early',
		validator: isAfter(new Date(oldestDate), new Date(value))
	}),
  isDateValid: () => date => ({
    message: 'Invalid date format. Please adhere to MM/DD/YYYY',
    validator: !(dateFieldsFormatted(date))
  }),
	email:  () => value => ({
		message: 'Please enter a valid email',
		validator: value && !emailExp.test(value)
	}),
	greaterThan: size => value => ({
		message: `Your field needs to be greater than ${size}`,
		validator: Number(value) < Number(size)
	}),
	lessThan: size => value => ({
		message: `Your field needs to be less than ${size}`,
		validator: Number(value) > Number(size)
	}),
	maxLength: length => value => ({
		message: `Your field can't be longer than ${length} characters`,
		validator: !value ? false : value.length > length
	}),
	minLength: length => value => ({
		message: `Your field needs to be longer than ${length} characters`,
		validator: !value ? false : value.length < length
	}),
	required: () => value => ({
		message: 'this field is required',
		validator: (Array.isArray(value) ? !value.length > 0 : value == '')
	})
}

export default validatorMap
