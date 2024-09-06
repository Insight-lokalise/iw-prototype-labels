import { isBefore, isAfter } from 'date-fns'
import { curry } from '@insight/toolkit-utils'

export const isRequired = value => {
	return !value && 'Sorry, this field is required'
}

export const dateTooLate = curry((maxDate, value) => {
	if (isBefore(new Date(maxDate), new Date(value))) {
		return `Sorry, that date needs to be on or after ${maxDate}`
	}
})

export const dateTooEarly = curry((maxDate, value) => {
	if (isAfter(new Date(maxDate), new Date(value))) {
		return `Sorry that date needs to be on or before ${maxDate}`
	}
})

export const dateProperlyFormatted = date => {
  const dateArrayLength = date.split('/').length
  return !(dateArrayLength === 3 && dateFieldsFormatted(date)) && `Invalid date format. Please adhere to MM/DD/YYYY`
}

export const dateFieldsFormatted = date => {
  const dateArray = date.split('/')
  return dateArray.length === 3 && dateArray[0].length === 2 && dateArray[1].length === 2 && dateArray[2].length === 4
}
