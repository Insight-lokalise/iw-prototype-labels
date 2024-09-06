import { dateTooEarly, isRequired, dateProperlyFormatted } from 'lib'

export default function validateDateFields (value) {
  const errors = [isRequired(value), dateTooEarly('01/01/2017', value), dateProperlyFormatted(value)].filter(Boolean)
  return errors.length > 0 ? errors[0] : undefined
}
