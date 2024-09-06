import moment from 'moment'

/**
 * Convert millisecs to DD-MMM-YYYY format (02-Jul-2017)
 * @param(date) - date in milliseconds
 */
export function convertMillsecToDate(date, format) {
  return moment(date).format(format)
}

/**
 * Onchange of dropdown for select type, the service expects date param in MM/DD/YYYY format
 * @param(date) - javascript date
 */
export function formatDate(selectedDate) {
  const date = new Date(selectedDate)
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
}

/**
 * set end date exactly 1 year from the selected start date
 * @param(date) - javascript date
 */
export function oneYearFromStartDate(date) {
  return new Date(date.setDate(date.getDate() + 365))
}

/**
 * set min end date exactly 1 year back from the selected end date
 * @param(date) - javascript date
 */
export function oneYearBackFromEndDate(date) {
  return new Date(date.setDate(date.getDate() - 365))
}

/**
 *  When form loads initially start date needs to default to 30days back including the current date in DD-MMM-YYYY format
 */
export function thirtyDaysAgo(date) {
  return new Date(date.setDate(date.getDate() - 30))
}

/**
 * Onload set start date exactly 3 year from the current date
 * @param(date) - javascript date
 */
export function threeYearsAgo(date) {
  return new Date(date.setDate(date.getDate() - 365 * 3))
}
