import { format, parse } from 'date-fns'

export function formatDate(date, dateFormat) {
  return format(date, dateFormat)
}

export function parseDate(date, dateFormat) {
  return parse(date, dateFormat)
}
