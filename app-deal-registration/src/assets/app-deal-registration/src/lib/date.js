// Seek to replace this with a custom format function.
// date-fns is treeshakable, but still better not to need the 
// unrequired dependency. 
import { format, parse } from 'date-fns'

export function formatDate(date, dateFormat) {
	// adding check to allow only date strings to be passed to format method
    return Date.parse(date) >= 0 ? format(date, dateFormat) : '';
}

export function parseDate(date, dateFormat) {
  // work around bug in date-fns - https://github.com/gpbl/react-day-picker/issues/908
  if('DD/MM/YYYY' === dateFormat) {
    const [day, month, year] = date.split('/').map(n => parseInt(n))
    return new Date(year, month - 1, day)
  }
	return parse(date, dateFormat)
}

export function cloneDate(date) {
	return new Date(date.getTime())
}

export function addMonths(date, months) {
	const newDate = cloneDate(date)
	newDate.setMonths(date.getMonth() + months)
	return newDate
}

export function toDate(arg) {
	const str = Object.prototype.toString.call(arg)
	if (
		arg instanceof Date ||
		(typeof arg === 'object' && str === '[object Date]')
	) {
		return new Date(arg.getTime())
	}

	if (typeof arg === 'number' || str === '[object Number]') {
		return new Date(arg)
	}

	return new Date(NaN)
}

export function isAfterDate(setDate, comparator) {
	const date = toDate(setDate)
	const toCompare = toDate(comparator)
	return date.getTime() > toCompare.getTime()
}

export function isBeforeDate(setDate, comparator) {
	const date = toDate(setDate)
	const toCompare = toDate(comparator)
	return date.getTime() < toCompare.getTime()
}
