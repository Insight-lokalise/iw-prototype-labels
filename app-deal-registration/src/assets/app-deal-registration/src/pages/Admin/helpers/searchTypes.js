import { DATE_FIELDS, DATE_TYPES_MAP, DEAL_FIELDS, SOLD_TO_FIELDS } from '../constants'

export const isDealField = type => (
  DEAL_FIELDS.includes(type)
)

export const isDateField = type => (
  DATE_FIELDS.includes(type)
)

export const isDateType = type => (
  DATE_TYPES_MAP.includes(type)
)

export const isSoldToField = type => (
  SOLD_TO_FIELDS.includes(type)
)

export const shouldDisplayDateType = type => (
	!isDateType(type) && !isDealField(type)
)
